import mongoose from 'mongoose';
import CommentSchema from '../schemas/CommentSchema.js';

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
