export default UserSchema;
declare const UserSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    posts: import("mongoose").Types.ObjectId[];
    stories: import("mongoose").Types.ObjectId[];
    mesModels: import("mongoose").Types.DocumentArray<{
        nombreDeCommande: number;
        note: number[];
        libelle?: string | null | undefined;
        idModel?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    photoProfile: string;
    role: string;
    MesCommand: import("mongoose").Types.ObjectId[];
    notes: import("mongoose").Types.DocumentArray<{
        rate?: number | null | undefined;
        raterId?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    signals: import("mongoose").Types.DocumentArray<{
        reason: string;
        idReporter?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    utilisateurBloque: import("mongoose").Types.ObjectId[];
    followers: string[];
    followings: string[];
    listeSouhaits: import("mongoose").Types.ObjectId[];
    notifications: import("mongoose").Types.DocumentArray<{
        type: string;
        createdAt: Date;
        message: string;
        postId?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    discussions: import("mongoose").Types.DocumentArray<{
        messages: import("mongoose").Types.DocumentArray<{
            createdAt: Date;
            content?: string | null | undefined;
        }>;
        user?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    CommandesUtilisateur: import("mongoose").Types.DocumentArray<{
        userId?: import("mongoose").Types.ObjectId | null | undefined;
        commandeId?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    badges: boolean[];
    status: "Premium" | "normal";
    certificat: boolean;
    favories: import("mongoose").Types.ObjectId[];
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
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    posts: import("mongoose").Types.ObjectId[];
    stories: import("mongoose").Types.ObjectId[];
    mesModels: import("mongoose").Types.DocumentArray<{
        nombreDeCommande: number;
        note: number[];
        libelle?: string | null | undefined;
        idModel?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    photoProfile: string;
    role: string;
    MesCommand: import("mongoose").Types.ObjectId[];
    notes: import("mongoose").Types.DocumentArray<{
        rate?: number | null | undefined;
        raterId?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    signals: import("mongoose").Types.DocumentArray<{
        reason: string;
        idReporter?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    utilisateurBloque: import("mongoose").Types.ObjectId[];
    followers: string[];
    followings: string[];
    listeSouhaits: import("mongoose").Types.ObjectId[];
    notifications: import("mongoose").Types.DocumentArray<{
        type: string;
        createdAt: Date;
        message: string;
        postId?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    discussions: import("mongoose").Types.DocumentArray<{
        messages: import("mongoose").Types.DocumentArray<{
            createdAt: Date;
            content?: string | null | undefined;
        }>;
        user?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    CommandesUtilisateur: import("mongoose").Types.DocumentArray<{
        userId?: import("mongoose").Types.ObjectId | null | undefined;
        commandeId?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    badges: boolean[];
    status: "Premium" | "normal";
    certificat: boolean;
    favories: import("mongoose").Types.ObjectId[];
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
}>> & import("mongoose").FlatRecord<{
    posts: import("mongoose").Types.ObjectId[];
    stories: import("mongoose").Types.ObjectId[];
    mesModels: import("mongoose").Types.DocumentArray<{
        nombreDeCommande: number;
        note: number[];
        libelle?: string | null | undefined;
        idModel?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    photoProfile: string;
    role: string;
    MesCommand: import("mongoose").Types.ObjectId[];
    notes: import("mongoose").Types.DocumentArray<{
        rate?: number | null | undefined;
        raterId?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    signals: import("mongoose").Types.DocumentArray<{
        reason: string;
        idReporter?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    utilisateurBloque: import("mongoose").Types.ObjectId[];
    followers: string[];
    followings: string[];
    listeSouhaits: import("mongoose").Types.ObjectId[];
    notifications: import("mongoose").Types.DocumentArray<{
        type: string;
        createdAt: Date;
        message: string;
        postId?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    discussions: import("mongoose").Types.DocumentArray<{
        messages: import("mongoose").Types.DocumentArray<{
            createdAt: Date;
            content?: string | null | undefined;
        }>;
        user?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    CommandesUtilisateur: import("mongoose").Types.DocumentArray<{
        userId?: import("mongoose").Types.ObjectId | null | undefined;
        commandeId?: import("mongoose").Types.ObjectId | null | undefined;
    }>;
    badges: boolean[];
    status: "Premium" | "normal";
    certificat: boolean;
    favories: import("mongoose").Types.ObjectId[];
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
    _id: import("mongoose").Types.ObjectId;
}>;
import { Schema } from "mongoose";
