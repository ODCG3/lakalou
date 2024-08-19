export default post;
declare const post: mongoose.Model<{
    datePublication: Date;
    description: string;
    titre: string;
    vues: mongoose.Types.ObjectId[] | Date[];
    model: mongoose.Types.ObjectId;
    utilisateur: mongoose.Types.ObjectId;
    commentaires: mongoose.Types.ObjectId[];
    partages: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    datePublication: Date;
    description: string;
    titre: string;
    vues: mongoose.Types.ObjectId[] | Date[];
    model: mongoose.Types.ObjectId;
    utilisateur: mongoose.Types.ObjectId;
    commentaires: mongoose.Types.ObjectId[];
    partages: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
}> & {
    datePublication: Date;
    description: string;
    titre: string;
    vues: mongoose.Types.ObjectId[] | Date[];
    model: mongoose.Types.ObjectId;
    utilisateur: mongoose.Types.ObjectId;
    commentaires: mongoose.Types.ObjectId[];
    partages: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    datePublication: Date;
    description: string;
    titre: string;
    vues: mongoose.Types.ObjectId[] | Date[];
    model: mongoose.Types.ObjectId;
    utilisateur: mongoose.Types.ObjectId;
    commentaires: mongoose.Types.ObjectId[];
    partages: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    datePublication: Date;
    description: string;
    titre: string;
    vues: mongoose.Types.ObjectId[] | Date[];
    model: mongoose.Types.ObjectId;
    utilisateur: mongoose.Types.ObjectId;
    commentaires: mongoose.Types.ObjectId[];
    partages: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
}>> & mongoose.FlatRecord<{
    datePublication: Date;
    description: string;
    titre: string;
    vues: mongoose.Types.ObjectId[] | Date[];
    model: mongoose.Types.ObjectId;
    utilisateur: mongoose.Types.ObjectId;
    commentaires: mongoose.Types.ObjectId[];
    partages: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
import mongoose from "mongoose";
