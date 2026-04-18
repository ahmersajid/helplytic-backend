import express from 'express';
import { deleteRequest, getStats } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.route('/stats')
    .get(protect, admin, getStats);

router.route('/requests/:id')
    .delete(protect, admin, deleteRequest);

export default router;
