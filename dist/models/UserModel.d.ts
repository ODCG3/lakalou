export default user;
declare const user: mongoose.Model<{
    posts: mongoose.Types.ObjectId[];
    stories: mongoose.Types.ObjectId[];
    mesModels: mongoose.Types.DocumentArray<{
        nombreDeCommande: number;
        note: number[];
        libelle?: string | null | undefined;
        idModel?: mongoose.Types.ObjectId | null | undefined;
    }>;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    photoProfile: string;
    role: string;
    MesCommand: mongoose.Types.ObjectId[];
    notes: mongoose.Types.DocumentArray<{
        rate?: number | null | undefined;
        raterId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    signals: mongoose.Types.DocumentArray<{
        reason: string;
        idReporter?: mongoose.Types.ObjectId | null | undefined;
    }>;
    utilisateurBloque: mongoose.Types.ObjectId[];
    followers: string[];
    followings: string[];
    listeSouhaits: mongoose.Types.ObjectId[];
    notifications: mongoose.Types.DocumentArray<{
        type: string;
        createdAt: Date;
        message: string;
        postId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    discussions: mongoose.Types.DocumentArray<{
        messages: mongoose.Types.DocumentArray<{
            createdAt: Date;
            content?: string | null | undefined;
        }>;
        user?: mongoose.Types.ObjectId | null | undefined;
    }>;
    CommandesUtilisateur: mongoose.Types.DocumentArray<{
        userId?: mongoose.Types.ObjectId | null | undefined;
        commandeId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    badges: boolean[];
    status: "Premium" | "normal";
    certificat: boolean;
    favories: mongoose.Types.ObjectId[];
    credits?: number | null | undefined;
    mesures?: {
        cou?: number | null | undefined;
        longueurPantallon?: number | null | undefined;
        epaule?: number | null | undefined;
        longueurManche?: number | null | undefined;
        hanche?: number | null | undefined;
        poitrine?: number | null | undefined;
        cuisse?: number | null | undefined;
        longueur?: number | null | undefined;
        tourBras?: number | null | undefined;
        tourPoignet?: number | null | undefined;
        ceinture?: number | null | undefined;
    } | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    posts: mongoose.Types.ObjectId[];
    stories: mongoose.Types.ObjectId[];
    mesModels: mongoose.Types.DocumentArray<{
        nombreDeCommande: number;
        note: number[];
        libelle?: string | null | undefined;
        idModel?: mongoose.Types.ObjectId | null | undefined;
    }>;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    photoProfile: string;
    role: string;
    MesCommand: mongoose.Types.ObjectId[];
    notes: mongoose.Types.DocumentArray<{
        rate?: number | null | undefined;
        raterId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    signals: mongoose.Types.DocumentArray<{
        reason: string;
        idReporter?: mongoose.Types.ObjectId | null | undefined;
    }>;
    utilisateurBloque: mongoose.Types.ObjectId[];
    followers: string[];
    followings: string[];
    listeSouhaits: mongoose.Types.ObjectId[];
    notifications: mongoose.Types.DocumentArray<{
        type: string;
        createdAt: Date;
        message: string;
        postId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    discussions: mongoose.Types.DocumentArray<{
        messages: mongoose.Types.DocumentArray<{
            createdAt: Date;
            content?: string | null | undefined;
        }>;
        user?: mongoose.Types.ObjectId | null | undefined;
    }>;
    CommandesUtilisateur: mongoose.Types.DocumentArray<{
        userId?: mongoose.Types.ObjectId | null | undefined;
        commandeId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    badges: boolean[];
    status: "Premium" | "normal";
    certificat: boolean;
    favories: mongoose.Types.ObjectId[];
    credits?: number | null | undefined;
    mesures?: {
        cou?: number | null | undefined;
        longueurPantallon?: number | null | undefined;
        epaule?: number | null | undefined;
        longueurManche?: number | null | undefined;
        hanche?: number | null | undefined;
        poitrine?: number | null | undefined;
        cuisse?: number | null | undefined;
        longueur?: number | null | undefined;
        tourBras?: number | null | undefined;
        tourPoignet?: number | null | undefined;
        ceinture?: number | null | undefined;
    } | null | undefined;
}> & {
    posts: mongoose.Types.ObjectId[];
    stories: mongoose.Types.ObjectId[];
    mesModels: mongoose.Types.DocumentArray<{
        nombreDeCommande: number;
        note: number[];
        libelle?: string | null | undefined;
        idModel?: mongoose.Types.ObjectId | null | undefined;
    }>;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    photoProfile: string;
    role: string;
    MesCommand: mongoose.Types.ObjectId[];
    notes: mongoose.Types.DocumentArray<{
        rate?: number | null | undefined;
        raterId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    signals: mongoose.Types.DocumentArray<{
        reason: string;
        idReporter?: mongoose.Types.ObjectId | null | undefined;
    }>;
    utilisateurBloque: mongoose.Types.ObjectId[];
    followers: string[];
    followings: string[];
    listeSouhaits: mongoose.Types.ObjectId[];
    notifications: mongoose.Types.DocumentArray<{
        type: string;
        createdAt: Date;
        message: string;
        postId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    discussions: mongoose.Types.DocumentArray<{
        messages: mongoose.Types.DocumentArray<{
            createdAt: Date;
            content?: string | null | undefined;
        }>;
        user?: mongoose.Types.ObjectId | null | undefined;
    }>;
    CommandesUtilisateur: mongoose.Types.DocumentArray<{
        userId?: mongoose.Types.ObjectId | null | undefined;
        commandeId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    badges: boolean[];
    status: "Premium" | "normal";
    certificat: boolean;
    favories: mongoose.Types.ObjectId[];
    credits?: number | null | undefined;
    mesures?: {
        cou?: number | null | undefined;
        longueurPantallon?: number | null | undefined;
        epaule?: number | null | undefined;
        longueurManche?: number | null | undefined;
        hanche?: number | null | undefined;
        poitrine?: number | null | undefined;
        cuisse?: number | null | undefined;
        longueur?: number | null | undefined;
        tourBras?: number | null | undefined;
        tourPoignet?: number | null | undefined;
        ceinture?: number | null | undefined;
    } | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    posts: mongoose.Types.ObjectId[];
    stories: mongoose.Types.ObjectId[];
    mesModels: mongoose.Types.DocumentArray<{
        nombreDeCommande: number;
        note: number[];
        libelle?: string | null | undefined;
        idModel?: mongoose.Types.ObjectId | null | undefined;
    }>;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    photoProfile: string;
    role: string;
    MesCommand: mongoose.Types.ObjectId[];
    notes: mongoose.Types.DocumentArray<{
        rate?: number | null | undefined;
        raterId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    signals: mongoose.Types.DocumentArray<{
        reason: string;
        idReporter?: mongoose.Types.ObjectId | null | undefined;
    }>;
    utilisateurBloque: mongoose.Types.ObjectId[];
    followers: string[];
    followings: string[];
    listeSouhaits: mongoose.Types.ObjectId[];
    notifications: mongoose.Types.DocumentArray<{
        type: string;
        createdAt: Date;
        message: string;
        postId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    discussions: mongoose.Types.DocumentArray<{
        messages: mongoose.Types.DocumentArray<{
            createdAt: Date;
            content?: string | null | undefined;
        }>;
        user?: mongoose.Types.ObjectId | null | undefined;
    }>;
    CommandesUtilisateur: mongoose.Types.DocumentArray<{
        userId?: mongoose.Types.ObjectId | null | undefined;
        commandeId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    badges: boolean[];
    status: "Premium" | "normal";
    certificat: boolean;
    favories: mongoose.Types.ObjectId[];
    credits?: number | null | undefined;
    mesures?: {
        cou?: number | null | undefined;
        longueurPantallon?: number | null | undefined;
        epaule?: number | null | undefined;
        longueurManche?: number | null | undefined;
        hanche?: number | null | undefined;
        poitrine?: number | null | undefined;
        cuisse?: number | null | undefined;
        longueur?: number | null | undefined;
        tourBras?: number | null | undefined;
        tourPoignet?: number | null | undefined;
        ceinture?: number | null | undefined;
    } | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    posts: mongoose.Types.ObjectId[];
    stories: mongoose.Types.ObjectId[];
    mesModels: mongoose.Types.DocumentArray<{
        nombreDeCommande: number;
        note: number[];
        libelle?: string | null | undefined;
        idModel?: mongoose.Types.ObjectId | null | undefined;
    }>;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    photoProfile: string;
    role: string;
    MesCommand: mongoose.Types.ObjectId[];
    notes: mongoose.Types.DocumentArray<{
        rate?: number | null | undefined;
        raterId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    signals: mongoose.Types.DocumentArray<{
        reason: string;
        idReporter?: mongoose.Types.ObjectId | null | undefined;
    }>;
    utilisateurBloque: mongoose.Types.ObjectId[];
    followers: string[];
    followings: string[];
    listeSouhaits: mongoose.Types.ObjectId[];
    notifications: mongoose.Types.DocumentArray<{
        type: string;
        createdAt: Date;
        message: string;
        postId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    discussions: mongoose.Types.DocumentArray<{
        messages: mongoose.Types.DocumentArray<{
            createdAt: Date;
            content?: string | null | undefined;
        }>;
        user?: mongoose.Types.ObjectId | null | undefined;
    }>;
    CommandesUtilisateur: mongoose.Types.DocumentArray<{
        userId?: mongoose.Types.ObjectId | null | undefined;
        commandeId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    badges: boolean[];
    status: "Premium" | "normal";
    certificat: boolean;
    favories: mongoose.Types.ObjectId[];
    credits?: number | null | undefined;
    mesures?: {
        cou?: number | null | undefined;
        longueurPantallon?: number | null | undefined;
        epaule?: number | null | undefined;
        longueurManche?: number | null | undefined;
        hanche?: number | null | undefined;
        poitrine?: number | null | undefined;
        cuisse?: number | null | undefined;
        longueur?: number | null | undefined;
        tourBras?: number | null | undefined;
        tourPoignet?: number | null | undefined;
        ceinture?: number | null | undefined;
    } | null | undefined;
}>> & mongoose.FlatRecord<{
    posts: mongoose.Types.ObjectId[];
    stories: mongoose.Types.ObjectId[];
    mesModels: mongoose.Types.DocumentArray<{
        nombreDeCommande: number;
        note: number[];
        libelle?: string | null | undefined;
        idModel?: mongoose.Types.ObjectId | null | undefined;
    }>;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    photoProfile: string;
    role: string;
    MesCommand: mongoose.Types.ObjectId[];
    notes: mongoose.Types.DocumentArray<{
        rate?: number | null | undefined;
        raterId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    signals: mongoose.Types.DocumentArray<{
        reason: string;
        idReporter?: mongoose.Types.ObjectId | null | undefined;
    }>;
    utilisateurBloque: mongoose.Types.ObjectId[];
    followers: string[];
    followings: string[];
    listeSouhaits: mongoose.Types.ObjectId[];
    notifications: mongoose.Types.DocumentArray<{
        type: string;
        createdAt: Date;
        message: string;
        postId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    discussions: mongoose.Types.DocumentArray<{
        messages: mongoose.Types.DocumentArray<{
            createdAt: Date;
            content?: string | null | undefined;
        }>;
        user?: mongoose.Types.ObjectId | null | undefined;
    }>;
    CommandesUtilisateur: mongoose.Types.DocumentArray<{
        userId?: mongoose.Types.ObjectId | null | undefined;
        commandeId?: mongoose.Types.ObjectId | null | undefined;
    }>;
    badges: boolean[];
    status: "Premium" | "normal";
    certificat: boolean;
    favories: mongoose.Types.ObjectId[];
    credits?: number | null | undefined;
    mesures?: {
        cou?: number | null | undefined;
        longueurPantallon?: number | null | undefined;
        epaule?: number | null | undefined;
        longueurManche?: number | null | undefined;
        hanche?: number | null | undefined;
        poitrine?: number | null | undefined;
        cuisse?: number | null | undefined;
        longueur?: number | null | undefined;
        tourBras?: number | null | undefined;
        tourPoignet?: number | null | undefined;
        ceinture?: number | null | undefined;
    } | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
import mongoose from "mongoose";
