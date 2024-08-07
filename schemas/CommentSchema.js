import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Assurez-vous que c'est le nom correct de votre modèle utilisateur
        /* required: true */
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Assurez-vous que c'est le nom correct de votre modèle de post
        /* required: true */
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
         /* required: false, */
    }
});

const Comment = mongoose.model('Comment', CommentSchema);

export default CommentSchema;
