import mongoose from 'mongoose';

const { Schema } = mongoose;


const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
    required: true
  },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  views: { type: Number, default: 0 },
  //j'ai ajouter blockerdUsers pour recuperes les utilisateurs bloques
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// Définir un index TTL pour faire expirer automatiquement les documents après 24h
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Story', storySchema);