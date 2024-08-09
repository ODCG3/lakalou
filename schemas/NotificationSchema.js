import { Schema } from 'mongoose';

const NotificationSchema = new Schema({
    type: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    createdAt: { type: Date, default: Date.now }
});

export default NotificationSchema;