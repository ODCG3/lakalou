import { now, Schema } from "mongoose";


const UserSchema = new Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    photoProfile: { type: String, required: true },
    role: { type: String, required: true },

    MesCommand: {
        type: [Schema.Types.ObjectId],
        ref: 'Commande',
    },
    notes: [{
        rate: { type: Number, min: 1, max: 5 },
        raterId: { type: Schema.Types.ObjectId, ref: 'User' }
    }
],
    signals: [{
        reason: { type: String, required: true },
        idReporter: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    mesures: {
        cou: Number,
        longueurPantallon: Number,
        epaule: Number,
        longueurManche: Number,
        hanche: Number,
        poitrine: Number,
        cuisse: Number,
        longueur: Number,
        tourBras: Number,
        tourPoignet: Number,
        ceinture: Number
    },
    utilisateurBloque: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    credits: Number,
    followers: {
        type: [String],
    },
    followings: {
        type: [String],
    },

    notifications: [{
        type: {
            type: String, // Type de la notification (ex: 'post', 'commentaire', etc.)
            required: true
        },
        message: { type: String, required: true },
        postId: { type: Schema.Types.ObjectId, ref: 'Post' },
        createdAt: { type: Date, default: Date.now }
    }],
    discussions: [
        {
            user: {type: Schema.Types.ObjectId, ref: 'User'},
            messages: [{
                content: String,
                createdAt: {type: Date,default: now()}
            }
            ]
        }
    ]

});
export default UserSchema;