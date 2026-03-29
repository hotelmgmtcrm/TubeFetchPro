import { exec } from 'child_process';
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

export const resolveInputType = (inputUrl: string) => {
  if (inputUrl.includes('youtube.com/watch') || inputUrl.includes('youtu.be/')) {
    return 'single_video';
  } else if (inputUrl.includes('youtube.com/@') || inputUrl.includes('youtube.com/channel/') || inputUrl.includes('youtube.com/c/')) {
    return 'channel_video';
  } else if (inputUrl.startsWith('@')) {
    return 'channel_video';
  }
  return 'unknown';
};

export const fetchVideoMetadata = async (videoUrl: string) => {
  try {
    const command = `${YT_DLP} --print "%(id)s,%(title)s,%(thumbnail)s,%(duration)s,%(uploader)s" --no-warnings "${videoUrl}"`;
    console.log(`[EXEC] ${command}`);
    const { stdout } = await execPromise(command);
    const [videoId, title, thumbnail, duration, channelName] = stdout.trim().split(',');
    
    return {
      videoId,
      title,
      thumbnail,
      duration: parseInt(duration) || 0,
      channelName,
    };
  } catch (error: any) {
    console.error(`[ERROR] yt-dlp metadata fetch failed: ${error.message}`);
    throw new Error('Failed to fetch video metadata. Ensure yt-dlp is installed and the URL is valid.');
  }
};

export const fetchChannelVideos = async (channelUrl: string, limit: number = 30) => {
  try {
    const command = `${YT_DLP} --flat-playlist --playlist-end ${limit} --print "%(uploader)s||%(id)s||%(title)s||%(duration)s||%(thumbnail)s" --no-warnings "${channelUrl}"`;
    console.log(`[EXEC] ${command}`);
    const { stdout } = await execPromise(command);

    const lines = stdout.trim().split('\n');
    let channelName = '';
    const videos = lines
      .filter(line => line.includes('||'))
      .map(line => {
        const parts = line.split('||');
        if (parts.length === 5) {
          channelName = parts[0];
          const [_, videoId, title, duration, thumbnail] = parts;
          return {
            videoId,
            title,
            duration: parseInt(duration) || 0,
            thumbnail,
          };
        }
        return null;
      })
      .filter(v => v !== null);

    return {
      channelUrl,
      channelName,
      fetchedVideos: videos as any[],
    };
  } catch (error: any) {
    console.error(`[ERROR] yt-dlp channel fetch failed: ${error.message}`);
    throw new Error('Failed to scan channel videos. Ensure the URL/Handle is valid.');
  }
};
