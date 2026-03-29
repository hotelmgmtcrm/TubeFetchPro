import { Request, Response } from 'express';
import VideoJob from '../models/VideoJob';
import UsageConsent from '../models/UsageConsent';
import { fetchVideoMetadata } from '../services/youtubeService';
import { addJobToQueue } from '../services/queueService';
import mongoose from 'mongoose';

export const createJob = async (req: Request, res: Response) => {
  try {
    const { sourceUrl, outputType, quality, consentAccepted, customFilename } = req.body;
    
    // Auth mocked for now
    const userId = new mongoose.Types.ObjectId(); 

    if (!consentAccepted) {
      return res.status(403).json({ error: 'You must provide consent representing legal authority to process this content.' });
    }

    // Record consent
    await UsageConsent.create({
      userId,
      sourceUrl,
      accepted: true,
      ipAddress: req.ip
    });

    const metadata = await fetchVideoMetadata(sourceUrl);

    const job = await VideoJob.create({
      userId,
      inputType: 'single_video',
      sourceUrl,
      videoId: metadata.videoId,
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      duration: metadata.duration,
      outputType,
      quality,
      customFilename,
      status: 'pending',
      consentAccepted
    });

    // Handle background processing
    addJobToQueue(job._id.toString());

    res.status(201).json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(); // mocked
    const jobs = await VideoJob.find({ userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const job = await VideoJob.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await VideoJob.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
