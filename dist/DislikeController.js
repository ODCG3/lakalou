var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default class DislikeController {
    // Disliker un post
    static dislikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const userId = req.user.userID; // Récupérer l'utilisateur depuis le token
                // Vérifier si le dislike existe déjà
                const existingDislike = yield prisma.dislikes.findFirst({
                    where: {
                        userId: userId,
                        postId: parseInt(postId, 10),
                    },
                });
                if (existingDislike) {
                    res.status(400).json({ message: "Vous avez déjà disliké ce post." });
                    return;
                }
                // Créer le dislike
                const dislike = yield prisma.dislikes.create({
                    data: {
                        userId: userId,
                        postId: parseInt(postId, 10),
                    },
                });
                res.status(200).json({ message: "Post disliké avec succès.", dislike });
            }
            catch (error) {
                console.error("Erreur lors du dislike d'un post :", error);
                res.status(500).json({ message: "Erreur du serveur.", error });
            }
        });
    }
    // Retirer un dislike
    // Retirer un dislike
    static undislikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params; // Récupérer seulement le postId depuis les paramètres
                const userId = req.user.userID; // ID de l'utilisateur à partir du token d'authentification
                // Trouver le dislike correspondant à cet utilisateur et ce post
                const existingDislike = yield prisma.dislikes.findFirst({
                    where: { userId, postId: parseInt(postId, 10) },
                });
                // Vérifier si le dislike existe
                if (!existingDislike) {
                    res.status(400).json({ message: "Vous n'avez pas disliké ce post." });
                    return;
                }
                // Supprimer le dislike
                yield prisma.dislikes.delete({
                    where: { id: existingDislike.id },
                });
                res.status(200).json({ message: "Dislike retiré avec succès." });
            }
            catch (error) {
                console.error("Erreur lors du retrait d'un dislike :", error);
                res.status(500).json({ message: "Erreur du serveur.", error });
            }
        });
    }
    // Récupérer tous les dislikes d'un post
    static getPostDislike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const dislikes = yield prisma.dislikes.findMany({
                    where: { postId: parseInt(postId, 10) },
                });
                res.status(200).json({ dislikes });
            }
            catch (error) {
                console.error("Erreur lors de la récupération des dislikes :", error);
                res.status(500).json({ message: "Erreur du serveur.", error });
            }
        });
    }
}
