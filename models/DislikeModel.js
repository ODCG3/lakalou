import mongoose from 'mongoose';
import DislikeSchema from '../schemas/DislikeSchema.js';

const Dislike = mongoose.model('Dislike', DislikeSchema);

export default Dislike;
