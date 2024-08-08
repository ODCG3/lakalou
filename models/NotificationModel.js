import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', NotificationSchema);
