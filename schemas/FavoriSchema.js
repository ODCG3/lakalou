import { Schema } from 'mongoose';

// Schéma pour les favoris
const FavoriSchema = new Schema({
    utilisateur: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

export default FavoriSchema;