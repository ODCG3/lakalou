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
            ref: "User",
        },
    ],
    credits: Number,
    followers: {
        type: [String],
    },
    followings: {
        type: [String],
    },
    listeSouhaits: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
    }],

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
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            messages: [{
                content: String,
                createdAt: { type: Date, default: now() }
            }
            ]
        }
    ],
    CommandesUtilisateur: [{

        commandeId: {
            type: Schema.Types.ObjectId,
            ref: 'Commande',
        },
        userId: { type: Schema.Types.ObjectId, ref: 'User' }
    }
    ],
    badges: [
        {
            type: Boolean,
            acquiredAt: { type: Date, default: Date.now } // Date d'acquisition du badge
        }
    ],
    status: {
        type: String,
        enum: ['Premium', 'normal'],
        default: 'normal'
    },
    certificat: {
        type: Boolean,
        default: false
    },
    posts:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    mesModels:[
        {
            idModel: {
                type: Schema.Types.ObjectId,
                ref: 'Model'
            },
            libelle: String,
            nombreDeCommande: {
                type: Number,
                default: 0
            },
            note: [Number]
        }
    ],
    favories:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    stories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Story'
        }
    ]

});
export default UserSchema;
