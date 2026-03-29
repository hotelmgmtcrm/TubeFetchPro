import express from 'express';
import { createJob, createBatchJobs, getHistory, getJob, deleteJob } from '../controllers/jobController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create', createJob);
router.post('/batch', createBatchJobs);
router.get('/history', getHistory);
router.get('/:id', getJob);
router.delete('/:id', deleteJob);

export default router;
