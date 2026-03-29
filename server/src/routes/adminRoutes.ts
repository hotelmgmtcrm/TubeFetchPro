import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = util.promisify(exec);
const router = express.Router();

router.get('/info', async (req: Request, res: Response) => {
  const getBinaryPath = () => {
    if (process.env.YT_DLP_PATH && process.env.YT_DLP_PATH !== 'yt-dlp') {
      return process.env.YT_DLP_PATH;
    }
    const localBin = path.join(__dirname, '../../bin/yt-dlp.exe');
    if (fs.existsSync(localBin)) {
      return `"${localBin}"`;
    }
    return 'yt-dlp';
  };

  const getFfmpegPath = () => {
    if (process.env.FFMPEG_PATH && process.env.FFMPEG_PATH !== 'ffmpeg') {
      return process.env.FFMPEG_PATH;
    }
    const localBin = path.join(__dirname, '../../bin/ffmpeg.exe');
    if (fs.existsSync(localBin)) {
      return `"${localBin}"`;
    }
    return 'ffmpeg';
  };

  const YT_DLP = getBinaryPath();
  const FFMPEG = getFfmpegPath();
  
  const status: any = {
    ytDlp: { found: false, version: null },
    ffmpeg: { found: false, version: null }
  };

  try {
    const { stdout } = await execPromise(`${YT_DLP} --version`);
    status.ytDlp = { found: true, version: stdout.trim() };
  } catch (err) {}

  try {
    const { stdout } = await execPromise(`${FFMPEG} -version`);
    status.ffmpeg = { found: true, version: stdout.trim().split('\n')[0] };
  } catch (err) {}

  res.json({
    system: process.platform,
    env: process.env.NODE_ENV,
    tools: status
  });
});

export default router;
