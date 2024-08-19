export default CommentSchema;
declare const CommentSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: Date;
    users?: mongoose.Types.ObjectId | null | undefined;
    post?: mongoose.Types.ObjectId | null | undefined;
    content?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: Date;
    users?: mongoose.Types.ObjectId | null | undefined;
    post?: mongoose.Types.ObjectId | null | undefined;
    content?: string | null | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: Date;
    users?: mongoose.Types.ObjectId | null | undefined;
    post?: mongoose.Types.ObjectId | null | undefined;
    content?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>;
import mongoose from 'mongoose';
