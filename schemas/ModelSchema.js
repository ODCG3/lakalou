import { Schema } from 'mongoose';


/* En tant qu'utilisateur je peux noter des models */
const ModelSchema = new Schema({
    libelle: { type: String, required: true },
    prix: Number,
    quantite: Number,
    contenu: [String],
    note: [{
        note: Number,
        commentaire: String,
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }]
});

export default ModelSchema;