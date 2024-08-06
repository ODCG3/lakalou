import mongoose from 'mongoose';
import likeSchema from '../schemas/likeShema.js';

const Like = mongoose.model('Like', likeSchema);

export default Like;
