import { Schema } from "mongoose";

const UserSchema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  photoProfile: { type: String, required: true },
  role: { type: String, required: true },
  followers: {
    type: [String],
  },
  followings: {
    type: [String],
  },
});

export default UserSchema;
