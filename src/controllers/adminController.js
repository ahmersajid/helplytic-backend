import Request from '../models/Request.js';
import User from '../models/User.js';

export const deleteRequest = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id);

        if (request) {
            await Request.deleteOne({ _id: request._id });
            res.json({ message: 'Request removed' });
        } else {
            res.status(404);
            throw new Error('Request not found');
        }
    } catch (error) {
        next(error);
    }
};

export const getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRequests = await Request.countDocuments();
        const solvedRequests = await Request.countDocuments({ status: 'solved' });

        res.json({
            totalUsers,
            totalRequests,
            solvedRequests
        });
    } catch (error) {
        next(error);
    }
};
