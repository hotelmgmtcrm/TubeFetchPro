import express from 'express';
import { createJob, getHistory, getJob, deleteJob } from '../controllers/jobController';

const router = express.Router();

router.post('/create', createJob);
router.get('/history', getHistory);
router.get('/:id', getJob);
router.delete('/:id', deleteJob);

export default router;
