import { Schema } from 'mongoose';

const PostSchema = new Schema({
    model: {
        type: Schema.Types.ObjectId,
        ref: 'Model',
        required: true
    },
    // contenues doit contenir les liens vers les images ou videos;
    utilisateur: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    datePublication: { type: Date, default: Date.now },
    commentaires: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    partages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Share'
        }
    ],
    dislikes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    description: {type: String,required: true},
    titre: {type: String,required: true},
    vues: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        {
            type: Date,
            default: Date.now
        }
    ]
});

export default PostSchema;