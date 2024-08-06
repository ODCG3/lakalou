import ModelSchema from "../schemas/ModelSchema.js";
import mongoose from "mongoose";

const model = mongoose.model("Model",ModelSchema);

export default model;