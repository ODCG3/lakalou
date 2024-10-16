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
// Ajouter un like
export const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params; // Récupérer l'ID du post
        const userId = req.user.userID; // Récupérer l'ID de l'utilisateur depuis le token
        // Vérifier si l'utilisateur a déjà liké le post
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
        // Créer un nouveau like
        const like = yield prisma.likes.create({
            data: {
                userId: userId,
                postId: parseInt(postId),
            },
        });
        // Mettre à jour le nombre de likes sur le post
        const post = yield prisma.posts.update({
            where: { id: parseInt(postId, 10) },
            data: {
                Likes: {
                    connect: { id: userId },
                },
            },
        });
        // Envoyer un message de succès
        res.status(200).json({ message: "Post aimé avec succès.", like });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur du serveur.", error });
    }
});
// Retirer un like
export const unlikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, likeID } = req.params;
        const userId = req.user.userID;
        const likeExist = yield prisma.likes.findUnique({
            where: { id: parseInt(likeID, 10) },
        });
        if (!likeExist) {
            res.status(400).json({ message: "Vous n'avez pas aimé ce post." });
            return;
        }
        const like = yield prisma.likes.delete({
            where: { id: parseInt(likeID, 10) },
        });
        // Mettre à jour le nombre de likes sur le post
        const post = yield prisma.posts.update({
            where: { id: parseInt(postId, 10) },
            data: {
                Likes: {
                    disconnect: { id: userId },
                },
            },
        });
        res
            .status(200)
            .json({ message: "Like retiré avec succès.", data: { like, post } });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur du serveur.", error });
    }
});
// Récupérer tous les likes d'un post
export const getPostLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const likes = yield prisma.likes.findMany({
            where: { postId: parseInt(postId, 10) },
        });
        res.status(200).json({ likes });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur du serveur.", error });
    }
});
