import express from 'express';
import {
    createRequest,
    getRequests,
    getRequestById,
    offerHelp,
    solveRequest
} from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(protect, createRequest)
    .get(getRequests);

router.route('/:id')
    .get(getRequestById);

router.route('/:id/help')
    .post(protect, offerHelp);

router.route('/:id/solve')
    .patch(protect, solveRequest);

export default router;
