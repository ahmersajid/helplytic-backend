import User from '../models/User.js';

export const getLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await User.find({ trustScore: { $gt: 0 } })
            .select('name trustScore badges location')
            .sort({ trustScore: -1 })
            .limit(10);

        res.json(leaderboard);
    } catch (error) {
        next(error);
    }
};
