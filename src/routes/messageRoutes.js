import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(protect, sendMessage);

router.route('/:userId')
    .get(protect, getMessages);

export default router;
