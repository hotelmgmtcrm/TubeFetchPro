import express from 'express';
import { resolveInput, fetchMetadata, fetchChannelVideos } from '../controllers/youtubeController';

const router = express.Router();

router.post('/resolve-input', resolveInput);
router.post('/video-metadata', fetchMetadata);
router.post('/channel-videos', fetchChannelVideos);

export default router;
