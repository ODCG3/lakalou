import mongoose from 'mongoose';

const CommandeModelsSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       // required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        /* required: true */
    },
    model_libelle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Model',
        /* required: true */
    },
    date_de_command: {
        type: Date,
        default: Date.now
    },
    adresseLivraison: {
        type: String,
        /* required: true */
    }
});

export default CommandeModelsSchema;
