import { Schema } from 'mongoose';

const ModelSchema = new Schema({
    libelle: {type: String, required: true},
    prix: Number
});

export default ModelSchema;