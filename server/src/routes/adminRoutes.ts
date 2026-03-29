import express from 'express';

const router = express.Router();

router.get('/users', (req, res) => res.send('Get Users'));
router.get('/jobs', (req, res) => res.send('Get Jobs'));
router.get('/analytics', (req, res) => res.send('Get Analytics'));
router.patch('/users/:id/suspend', (req, res) => res.send('Suspend User'));
router.delete('/jobs/:id', (req, res) => res.send('Delete Job'));

export default router;
