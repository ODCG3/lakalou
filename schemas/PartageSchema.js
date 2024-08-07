import mongoose from 'mongoose';

const PartageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Assurez-vous que c'est le nom correct de votre modèle utilisateur
        /* required: true */
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    sharedAt: {
        type: Date,
        default: Date.now
    }
});

export default PartageSchema;
