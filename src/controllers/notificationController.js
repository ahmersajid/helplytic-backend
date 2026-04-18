import Notification from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (notification) {
            if (notification.user.toString() !== req.user._id.toString()) {
                res.status(403);
                throw new Error('Not authorized to access this notification');
            }

            notification.read = true;
            const updatedNotification = await notification.save();
            res.json(updatedNotification);
        } else {
            res.status(404);
            throw new Error('Notification not found');
        }
    } catch (error) {
        next(error);
    }
};
