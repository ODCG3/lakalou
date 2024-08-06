import FavoriSchema from "../schemas/FavoriSchema.js";
import mongoose from "mongoose";

// Créer le modèle basé sur le schéma
const favori = mongoose.model("Favori",FavoriSchema);

export default favori;