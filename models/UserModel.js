import UserSchema from "../schemas/UserSchema.js";
import mongoose from "mongoose";

const user = mongoose.model("User",UserSchema);

export default user;