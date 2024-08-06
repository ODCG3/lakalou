import PostSchema from "../schemas/PostSchema.js";
import mongoose from "mongoose";

const post = mongoose.model("Post",PostSchema);

export default post;