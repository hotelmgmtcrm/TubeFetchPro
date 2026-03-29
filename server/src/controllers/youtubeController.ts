import { Request, Response } from 'express';
import { resolveInputType, fetchVideoMetadata } from '../services/youtubeService';
import * as youtubeService from '../services/youtubeService';
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
    let { channelUrl } = req.body;
    if (!channelUrl) return res.status(400).json({ error: 'channelUrl is required' });

    // Handle @username shorthand
    if (channelUrl.startsWith('@')) {
      channelUrl = `https://www.youtube.com/${channelUrl}`;
    }

    // 1. Check ChannelCache first
    const cache = await ChannelCache.findOne({ channelUrl });
    if (cache) {
      // Return cached results if less than 1 hour old (freq update for dev)
      const isFresh = (new Date().getTime() - new Date(cache.lastFetchedAt).getTime()) < 1 * 60 * 60 * 1000;
      if (isFresh) {
        return res.json(cache);
      }
    }

    // 2. Fetch from YouTube with real service
    const rawData = await youtubeService.fetchChannelVideos(channelUrl);
    
    // 3. Update/Save to Cache
    const updatedCache = await ChannelCache.findOneAndUpdate(
      { channelUrl },
      { 
        channelName: rawData.channelName || channelUrl.split('/').pop() || 'YouTube Channel',
        fetchedVideos: rawData.fetchedVideos,
        lastFetchedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json(updatedCache);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
