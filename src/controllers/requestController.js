import Request from '../models/Request.js';
import User from '../models/User.js';
import { analyzeRequest } from '../utils/aiHelper.js';

export const createRequest = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        // AI Feature: Auto-detect urgency, category, and tags
        const { urgency, category, tags } = analyzeRequest(title, description);

        const request = await Request.create({
            title,
            description,
            category,
            tags,
            urgency,
            createdBy: req.user._id,
        });

        res.status(201).json(request);
    } catch (error) {
        next(error);
    }
};

export const getRequests = async (req, res, next) => {
    try {
        const requests = await Request.find({}).populate('createdBy', 'name trustScore');
        res.json(requests);
    } catch (error) {
        next(error);
    }
};

export const getRequestById = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate('createdBy', 'name trustScore')
            .populate('helpers', 'name');

        if (request) {
            res.json(request);
        } else {
            res.status(404);
            throw new Error('Request not found');
        }
    } catch (error) {
        next(error);
    }
};

export const offerHelp = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id);

        if (request) {
            if (request.createdBy.toString() === req.user._id.toString()) {
                res.status(400);
                throw new Error('You cannot offer help on your own request');
            }

            if (request.helpers.includes(req.user._id)) {
                res.status(400);
                throw new Error('You have already offered help');
            }

            request.helpers.push(req.user._id);
            if (request.status === 'open') {
                request.status = 'in-progress';
            }

            const updatedRequest = await request.save();
            res.json(updatedRequest);
        } else {
            res.status(404);
            throw new Error('Request not found');
        }
    } catch (error) {
        next(error);
    }
};

export const solveRequest = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id);

        if (request) {
            // Only the creator can mark it as solved
            if (request.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                res.status(403);
                throw new Error('Not authorized to mark this as solved');
            }

            request.status = 'solved';
            const updatedRequest = await request.save();

            // Bonus: Reward helpers with trustScore
            if (updatedRequest.helpers && updatedRequest.helpers.length > 0) {
                await User.updateMany(
                    { _id: { $in: updatedRequest.helpers } },
                    { $inc: { trustScore: 10 } }
                );
            }

            res.json(updatedRequest);
        } else {
            res.status(404);
            throw new Error('Request not found');
        }
    } catch (error) {
        next(error);
    }
};
