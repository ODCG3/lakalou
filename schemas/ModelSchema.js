import { Schema } from 'mongoose';

const ModelSchema = new Schema({
    libelle: {type: String, required: true},
    prix: Number,
    quantite: Number,
    contenu: [String]
});

export default ModelSchema;