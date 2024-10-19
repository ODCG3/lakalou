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
export default class LikeController {
    // Ajouter un like
    static likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const userId = req.user.userID; // Récupérer l'utilisateur depuis le token
                console.log(userId);
                // Vérifier si le like existe déjà
                const existingLike = yield prisma.likes.findFirst({
                    where: {
                        userId: userId,
                        postId: parseInt(postId, 10),
                    },
                });
                if (existingLike) {
                    res.status(400).json({ message: "Vous avez déjà aimé ce post." });
                    return;
                }
                // Créer le like
                const like = yield prisma.likes.create({
                    data: {
                        userId: userId,
                        postId: parseInt(postId, 10),
                    },
                });
                res.status(200).json({ message: "Post aimé avec succès.", like });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur du serveur.", error });
            }
        });
    }
    // Retirer un like (modifié)
    static unlikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const userId = req.user.userID;
                // Trouver le like correspondant à cet utilisateur et ce post
                const existingLike = yield prisma.likes.findFirst({
                    where: { userId, postId: parseInt(postId, 10) },
                });
                if (!existingLike) {
                    res.status(400).json({ message: "Vous n'avez pas aimé ce post." });
                    return;
                }
                // Supprimer le like
                yield prisma.likes.delete({
                    where: { id: existingLike.id },
                });
                res.status(200).json({ message: "Like retiré avec succès." });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur du serveur.", error });
            }
        });
    }
    // Compter les likes d'un post
    static countPostLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                // Compter le nombre de likes pour le post donné
                const likeCount = yield prisma.likes.count({
                    where: { postId: parseInt(postId, 10) },
                });
                res.status(200).json({ postId: parseInt(postId, 10), likeCount });
            }
            catch (error) {
                console.error("Erreur lors du comptage des likes :", error);
                res.status(500).json({ message: "Erreur du serveur.", error });
            }
        });
    }
}
