import mongoose from 'mongoose';
import PartageSchema from '../schemas/PartageSchema.js';

const partage = mongoose.model('partage', PartageSchema);

export default partage;
