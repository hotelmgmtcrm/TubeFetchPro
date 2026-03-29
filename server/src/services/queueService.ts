import PQueue from 'p-queue';
import * as ffmpeg from 'fluent-ffmpeg';
import VideoJob from '../models/VideoJob';
import { convertToMp3 } from './ffmpegService';
import { uploadToCloudinary } from './cloudinaryService';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import util from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = util.promisify(exec);

const getBinaryPath = () => {
  if (process.env.YT_DLP_PATH && process.env.YT_DLP_PATH !== 'yt-dlp') {
    return process.env.YT_DLP_PATH;
  }
  // Check project local bin
  const localBin = path.join(__dirname, '../../bin/yt-dlp.exe');
  if (fs.existsSync(localBin)) {
    return `"${localBin}"`;
  }
  return 'yt-dlp';
};

const YT_DLP = getBinaryPath();
const queue = new PQueue({ concurrency: 1 });

export const addJobToQueue = (jobId: string) => {
  console.log(`[WORKER] Job ${jobId} added to queue.`);
  queue.add(async () => {
    const job = await VideoJob.findById(jobId);
    if (!job) return;

    console.log(`[WORKER] Processing job ${jobId} (${job.title})...`);
    
    try {
      job.status = 'processing';
      await job.save();

      const tempDir = path.resolve(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const rawFilePath = path.join(tempDir, `${job.videoId}_raw.mp4`);
      
      // 1. Download Video with yt-dlp
      console.log(`[WORKER] Downloading ${job.sourceUrl} ...`);
      try {
        // Add a 5 minute timeout for safety
        const downloadCommand = `${YT_DLP} -o "${rawFilePath}" -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --no-playlist "${job.sourceUrl}"`;
        console.log(`[WORKER] Running: ${downloadCommand}`);
        await execPromise(downloadCommand, { timeout: 300000 }); // 5 mins
      } catch (dlError: any) {
        console.error(`[WORKER DOWNLOAD ERROR] ${dlError.message}`);
        throw new Error(`Download failed: ${dlError.message}`);
      }

      if (!fs.existsSync(rawFilePath)) {
        throw new Error('Downloaded file not found on disk.');
      }

      let finalFilePath = rawFilePath;
      let resourceType: 'video' | 'raw' | 'auto' = 'video';

      // 2. Convert if needed
      if (job.outputType === 'mp3') {
        console.log(`[WORKER] Converting to MP3...`);
        job.status = 'converting';
        await job.save();
        const mp3Path = path.join(tempDir, `${job.videoId}.mp3`);
        await convertToMp3(rawFilePath, mp3Path);
        finalFilePath = mp3Path;
        resourceType = 'auto';
      }

      // 3. Upload to Cloudinary
      console.log(`[WORKER] Uploading to Cloudinary...`);
      job.status = 'uploading';
      await job.save();
      const uploadResult = await uploadToCloudinary(
        finalFilePath, 
        job.customFilename || `${job.videoId}_${Date.now()}`,
        resourceType
      );

      // 4. Update Job
      job.status = 'completed';
      job.downloadUrl = uploadResult.url;
      job.fileSize = uploadResult.size;
      await job.save();
      console.log(`[WORKER] Job ${jobId} completed successfully. URL: ${uploadResult.url}`);

    } catch (error: any) {
      console.error(`[WORKER ERROR] Job ${jobId} failed:`, error.message);
      job.status = 'failed';
      job.errorMessage = error.message;
      await job.save();
    } finally {
      // Cleanup temp files
      try {
        const tempDir = path.resolve(__dirname, '../../temp');
        const rawFilePath = path.join(tempDir, `${job.videoId}_raw.mp4`);
        const mp3Path = path.join(tempDir, `${job.videoId}.mp3`);
        
        if (fs.existsSync(rawFilePath)) fs.unlinkSync(rawFilePath);
        if (fs.existsSync(mp3Path)) fs.unlinkSync(mp3Path);
        console.log(`[WORKER CLEANUP] Deleted temp files for job ${job.videoId}`);
      } catch (cleanupErr: any) {
        console.error(`[WORKER CLEANUP ERROR] ${cleanupErr.message}`);
      }
    }
  });
};
