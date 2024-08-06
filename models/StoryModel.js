import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  mediaUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

// Définir un index TTL pour faire expirer automatiquement les documents après 24h
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Story', storySchema);