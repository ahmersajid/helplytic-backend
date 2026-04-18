import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    status: { type: String, enum: ['open', 'in-progress', 'solved'], default: 'open' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    helpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true
});

const Request = mongoose.model('Request', requestSchema);
export default Request;
