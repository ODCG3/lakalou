import mongoose from 'mongoose';

const CommandeModelsSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    story_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story'
    },
    model_libelle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Model',
        required: true
    },
    date_de_command: {
        type: Date,
        default: Date.now
    },
    adresseLivraison: {
        type: String,
        //required: true
    }
});

// Validation personnalisée pour s'assurer que soit post_id, soit story_id est défini
CommandeModelsSchema.pre('validate', function (next) {
    if (!this.post_id && !this.story_id) {
        next(new Error('Soit post_id, soit story_id doit être fourni'));
    } else {
        next();
    }
});


export default CommandeModelsSchema;
