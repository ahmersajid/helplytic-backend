import Message from '../models/Message.js';

export const sendMessage = async (req, res, next) => {
    try {
        const { receiverId, message } = req.body;

        if (!receiverId || !message) {
            res.status(400);
            throw new Error('Please provide receiverId and message');
        }

        const newMessage = await Message.create({
            senderId: req.user._id,
            receiverId,
            message
        });

        res.status(201).json(newMessage);
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: req.user._id, receiverId: userId },
                { senderId: userId, receiverId: req.user._id }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        next(error);
    }
};
