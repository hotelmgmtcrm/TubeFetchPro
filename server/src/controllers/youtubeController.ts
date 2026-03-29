import { Request, Response } from 'express';
import { resolveInputType, fetchVideoMetadata } from '../services/youtubeService';
import ChannelCache from '../models/ChannelCache';
import { v4 as uuidv4 } from 'uuid';

export const resolveInput = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const type = resolveInputType(url);
    res.json({ type, originalUrl: url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchMetadata = async (req: Request, res: Response) => {
  try {
    const { videoUrl } = req.body;
    if (!videoUrl) return res.status(400).json({ error: 'videoUrl is required' });

    const metadata = await fetchVideoMetadata(videoUrl);
    res.json(metadata);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchChannelVideos = async (req: Request, res: Response) => {
  try {
    const { channelUrl } = req.body;
    if (!channelUrl) return res.status(400).json({ error: 'channelUrl is required' });

    // In a real implementation:
    // 1. Check ChannelCache first
    // 2. If stale or missing, use yt-dlp to list channel videos
    // 3. Save to ChannelCache and return

    const cache = await ChannelCache.findOne({ channelUrl });
    if (cache) {
      return res.json(cache);
    }

    if (channelUrl.includes('supercdrama') || channelUrl.includes('@supercdrama')) {
      return res.json({
        channelName: 'Super C-Drama',
        avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_k...',
        fetchedVideos: [
          { title: 'The Double EP 1 | Wu Jinyan, Wang Xingyue', videoId: 'V1-2024-001', duration: 2400, thumbnail: 'https://i.ytimg.com/vi/V1/maxres.jpg' },
          { title: 'The Double EP 2 | Wu Jinyan, Wang Xingyue', videoId: 'V1-2024-002', duration: 2400, thumbnail: 'https://i.ytimg.com/vi/V2/maxres.jpg' },
          { title: 'Blossoms in Adversity EP 1 | Hu Yitian, Zhang Jingyi', videoId: 'V1-2024-003', duration: 2500, thumbnail: 'https://i.ytimg.com/vi/V3/maxres.jpg' },
        ]
      });
    }

    // Default dummy response
    res.json({
      channelName: 'Example Channel',
      avatar: '',
      fetchedVideos: [
         { title: 'Video 1', videoId: uuidv4(), duration: 120, thumbnail: '' }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
