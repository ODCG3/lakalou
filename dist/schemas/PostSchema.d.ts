export default PostSchema;
declare const PostSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    datePublication: Date;
    description: string;
    titre: string;
    vues: import("mongoose").Types.ObjectId[] | Date[];
    model: import("mongoose").Types.ObjectId;
    utilisateur: import("mongoose").Types.ObjectId;
    commentaires: import("mongoose").Types.ObjectId[];
    partages: import("mongoose").Types.ObjectId[];
    dislikes: import("mongoose").Types.ObjectId[];
    likes: import("mongoose").Types.ObjectId[];
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    datePublication: Date;
    description: string;
    titre: string;
    vues: import("mongoose").Types.ObjectId[] | Date[];
    model: import("mongoose").Types.ObjectId;
    utilisateur: import("mongoose").Types.ObjectId;
    commentaires: import("mongoose").Types.ObjectId[];
    partages: import("mongoose").Types.ObjectId[];
    dislikes: import("mongoose").Types.ObjectId[];
    likes: import("mongoose").Types.ObjectId[];
}>> & import("mongoose").FlatRecord<{
    datePublication: Date;
    description: string;
    titre: string;
    vues: import("mongoose").Types.ObjectId[] | Date[];
    model: import("mongoose").Types.ObjectId;
    utilisateur: import("mongoose").Types.ObjectId;
    commentaires: import("mongoose").Types.ObjectId[];
    partages: import("mongoose").Types.ObjectId[];
    dislikes: import("mongoose").Types.ObjectId[];
    likes: import("mongoose").Types.ObjectId[];
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
import { Schema } from 'mongoose';
