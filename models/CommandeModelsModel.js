import mongoose from 'mongoose';
import CommandeModelsSchema from '../schemas/CommandeModelsSchema.js';

const CommandeModels = mongoose.model('CommandeModels', CommandeModelsSchema);

export default CommandeModels;
