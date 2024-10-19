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
export default class CommentController {
    // Ajouter un commentaire à un post
    static addComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userID;
                const postId = parseInt(req.params.postId, 10);
                const { content } = req.body;
                if (!content) {
                    return res.status(400).json({ msg: "Le contenu du commentaire est requis" });
                }
                const post = yield prisma.posts.findUnique({ where: { id: postId } });
                if (!post) {
                    return res.status(404).json({ msg: "Post non trouvé" });
                }
                const newComment = yield prisma.comments.create({
                    data: { userId, postId, content },
                });
                return res.status(201).json({ msg: "Commentaire ajouté avec succès", newComment });
            }
            catch (err) {
                console.error("Erreur lors de l'ajout du commentaire :", err);
                return res.status(500).json({ msg: "Erreur serveur", error: err });
            }
        });
    }
    // Supprimer un commentaire
    static deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentId = parseInt(req.params.commentId, 10);
                const userId = req.user.userID;
                const comment = yield prisma.comments.findUnique({ where: { id: commentId } });
                if (!comment) {
                    return res.status(404).json({ msg: "Commentaire non trouvé" });
                }
                if (comment.userId !== userId) {
                    return res.status(403).json({ msg: "Vous n'avez pas les droits pour supprimer ce commentaire" });
                }
                yield prisma.comments.delete({ where: { id: commentId } });
                return res.json({ msg: "Commentaire supprimé avec succès" });
            }
            catch (err) {
                console.error("Erreur lors de la suppression du commentaire :", err);
                return res.status(500).json({ msg: "Erreur serveur", error: err });
            }
        });
    }
    // Récupérer les commentaires d'un post
    // Ajouter une réponse à un commentaire
    static addReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userID;
                const parentId = parseInt(req.params.commentId, 10);
                const { content } = req.body;
                if (!content) {
                    return res.status(400).json({ msg: "Le contenu de la réponse est requis" });
                }
                // Vérifier si le commentaire parent existe
                const parentComment = yield prisma.comments.findUnique({ where: { id: parentId } });
                if (!parentComment) {
                    return res.status(404).json({ msg: "Commentaire parent non trouvé" });
                }
                // Créer la réponse
                const newReply = yield prisma.comments.create({
                    data: {
                        content,
                        userId,
                        parentId,
                    },
                });
                return res.status(201).json({ msg: "Réponse ajoutée avec succès", newReply });
            }
            catch (err) {
                console.error("Erreur lors de l'ajout de la réponse :", err);
                return res.status(500).json({ msg: "Erreur serveur", error: err });
            }
        });
    }
    // Récupérer les commentaires d'un post avec les réponses imbriquées
    static getPostComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = parseInt(req.params.postId, 10);
                const post = yield prisma.posts.findUnique({
                    where: { id: postId },
                    include: {
                        Comments: {
                            where: { parentId: null }, // Récupère uniquement les commentaires de niveau supérieur
                            include: {
                                Users: { select: { nom: true, prenom: true, photoProfile: true } },
                                Replies: {
                                    include: {
                                        Users: { select: { nom: true, prenom: true, photoProfile: true } },
                                    },
                                },
                            },
                        },
                    },
                });
                if (!post) {
                    return res.status(404).json({ msg: "Post non trouvé" });
                }
                const commentsWithReplies = post.Comments.map((comment) => {
                    var _a, _b, _c;
                    return ({
                        id: comment.id,
                        content: comment.content,
                        createdAt: comment.createdAt,
                        userId: comment.userId,
                        nom: (_a = comment.Users) === null || _a === void 0 ? void 0 : _a.nom,
                        prenom: (_b = comment.Users) === null || _b === void 0 ? void 0 : _b.prenom,
                        photoProfile: (_c = comment.Users) === null || _c === void 0 ? void 0 : _c.photoProfile,
                        replies: comment.Replies.map((reply) => {
                            var _a, _b, _c;
                            return ({
                                id: reply.id,
                                content: reply.content,
                                createdAt: reply.createdAt,
                                userId: reply.userId,
                                nom: (_a = reply.Users) === null || _a === void 0 ? void 0 : _a.nom,
                                prenom: (_b = reply.Users) === null || _b === void 0 ? void 0 : _b.prenom,
                                photoProfile: (_c = reply.Users) === null || _c === void 0 ? void 0 : _c.photoProfile,
                            });
                        }),
                    });
                });
                return res.json({ comments: commentsWithReplies });
            }
            catch (err) {
                console.error("Erreur lors de la récupération des commentaires :", err);
                return res.status(500).json({ msg: "Erreur serveur", error: err });
            }
        });
    }
}
