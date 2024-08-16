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
export default class PostController {
    static createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utilisateurId = req.user.userID;
                const connectedUser = yield prisma.users.findUnique({
                    where: { id: utilisateurId },
                });
                if (!connectedUser) {
                    return res.status(404).json({ error: "Utilisateur non trouvé." });
                }
                if (connectedUser.role !== "tailleur") {
                    return res.status(403).json({ error: "Seuls les tailleurs peuvent créer des posts." });
                }
                const { modelId, description, titre } = req.body;
                if (!modelId || !description || !titre) {
                    return res.status(400).json({ error: "Tous les champs (modelId, description, titre) sont requis." });
                }
                const modelExists = yield prisma.models.findUnique({
                    where: { id: modelId },
                });
                if (!modelExists) {
                    return res.status(404).json({ error: "Le modèle spécifié n'existe pas." });
                }
                if ((connectedUser === null || connectedUser === void 0 ? void 0 : connectedUser.credits) > 0) {
                    const createdPost = yield prisma.posts.create({
                        data: {
                            modelId,
                            utilisateurId: utilisateurId,
                            description,
                            titre,
                            datePublication: new Date(),
                            vues: 0,
                        }
                    });
                    yield prisma.users.update({
                        where: { id: utilisateurId },
                        data: { credits: { decrement: 1 } }
                    });
                    res.status(201).json({ message: "Post créé avec succès", post: createdPost });
                }
                else {
                    res.status(403).json({ error: 'Vous n\'avez pas assez de crédits pour poster. Veuillez recharger votre compte.' });
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        });
    }
    static getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield prisma.posts.findMany();
                res.status(200).json(posts);
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        });
    }
    static getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            try {
                // Récupérer le post par son ID avec Prisma
                const postData = yield prisma.posts.findUnique({
                    where: { id: parseInt(postId) }
                    // include: {
                    //     utilisateurId: true, // Inclure les informations de l'utilisateur ayant créé le post
                    //     model: true, // Inclure les informations du modèle lié au post
                    //     likes: true, // Inclure les likes associés au post
                    //     dislikes: true, // Inclure les dislikes associés au post
                    //     comments: true, // Inclure les commentaires associés au post
                    // },
                });
                // Vérifier si le post existe
                if (!postData) {
                    return res.status(404).json({ error: 'Post not found' });
                }
                // Retourner le post récupéré
                res.status(200).json(postData);
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        });
    }
    static deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            const utilisateurId = req.user.userID;
            try {
                // Vérification si le post existe
                const post = yield prisma.posts.findUnique({
                    where: { id: parseInt(postId) },
                });
                if (!post) {
                    return res.status(404).json({ error: "Post non trouvé." });
                }
                // Vérification si l'utilisateur est le créateur du post
                if (post.utilisateurId !== utilisateurId) {
                    return res.status(403).json({ error: "Vous n'êtes pas autorisé à supprimer ce post." });
                }
                // Suppression du post
                yield prisma.posts.delete({
                    where: { id: parseInt(postId) },
                });
                res.status(200).json({ message: "Post supprimé avec succès." });
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur interne du serveur.' });
            }
        });
    }
}
