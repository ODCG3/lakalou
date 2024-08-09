import { Schema } from 'mongoose';

const NotificationSchema = new Schema({
    message: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    createdAt: { type: Date, default: Date.now }
});

export default NotificationSchema;