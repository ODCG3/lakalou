export default Comment;
declare const Comment: mongoose.Model<{
    createdAt: Date;
    users?: mongoose.Types.ObjectId | null | undefined;
    post?: mongoose.Types.ObjectId | null | undefined;
    content?: string | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: Date;
    users?: mongoose.Types.ObjectId | null | undefined;
    post?: mongoose.Types.ObjectId | null | undefined;
    content?: string | null | undefined;
}> & {
    createdAt: Date;
    users?: mongoose.Types.ObjectId | null | undefined;
    post?: mongoose.Types.ObjectId | null | undefined;
    content?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
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
}>>;
import mongoose from 'mongoose';
