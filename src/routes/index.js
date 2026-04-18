import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import requestRoutes from './requestRoutes.js';
import leaderboardRoutes from './leaderboardRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import messageRoutes from './messageRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/requests', requestRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/notifications', notificationRoutes);
router.use('/messages', messageRoutes);
router.use('/admin', adminRoutes);

export default router;
