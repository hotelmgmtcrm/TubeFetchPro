import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

const getFfmpegPath = () => {
  if (process.env.FFMPEG_PATH && process.env.FFMPEG_PATH !== 'ffmpeg') {
    return process.env.FFMPEG_PATH;
  }
  // Check project local bin
  const localBin = path.join(__dirname, '../../bin/ffmpeg.exe');
  if (fs.existsSync(localBin)) {
    return localBin;
  }
  return 'ffmpeg';
};

ffmpeg.setFfmpegPath(getFfmpegPath());

export const convertToMp3 = async (inputPath: string, outputPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp3')
      .on('start', (commandLine) => {
        console.log(`Spawned FFmpeg with command: ${commandLine}`);
      })
      .on('error', (err) => {
        console.error(`An error occurred: ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        console.log('FFmpeg processing finished!');
        // Optional: Cleanup original video file if needed
        if (fs.existsSync(inputPath)) {
          fs.unlinkSync(inputPath);
        }
        resolve(outputPath);
      })
      .save(outputPath);
  });
};
