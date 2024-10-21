var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default class DislikeController {
    // Disliker un post
    static dislikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const userId = req.user.userID;
                const existingDislike = yield prisma.dislikes.findFirst({
                    where: {
                        userId: userId,
                        postId: parseInt(postId, 10),
                    },
                });
                if (existingDislike) {
                    res.status(400).json({ message: 'Vous avez déjà disaimé ce post.' });
                    return;
                }
                const dislike = yield prisma.dislikes.create({
                    data: {
                        userId: userId,
                        postId: parseInt(postId, 10),
                    },
                });
                res.status(201).json({ message: 'Post disaimé avec succès.', dislike });
            }
            catch (error) {
                res.status(500).json({ message: 'Erreur du serveur.', error });
            }
        });
    }
    // Retirer un dislike
    static undislikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, dislikeID } = req.params;
                const userId = req.user.userID;
                const dislikeExist = yield prisma.dislikes.findUnique({
                    where: { id: parseInt(dislikeID, 10) },
                });
                if (!dislikeExist) {
                    res.status(400).json({ message: 'Vous n\'avez pas disaimé ce post.' });
                    return;
                }
                const dislike = yield prisma.dislikes.delete({
                    where: { id: parseInt(dislikeID, 10) },
                });
                res.status(200).json({ message: 'Dislike retiré avec succès.', dislike });
            }
            catch (error) {
                res.status(500).json({ message: 'Erreur du serveur.', error });
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
                res.status(500).json({ message: 'Erreur du serveur.', error });
            }
        });
    }
}
