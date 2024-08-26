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
    static addComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userID;
                const postId = parseInt(req.params.postId);
                const content = req.body.content;
                if (!content) {
                    res.status(400).json({ msg: "Le contenu du commentaire est requis" });
                    return;
                }
                const user = yield prisma.users.findUnique({ where: { id: userId } });
                const post = yield prisma.posts.findUnique({ where: { id: postId } });
                if (!post) {
                    res.status(404).json({ msg: "Post non trouvé" });
                    return;
                }
                const newComment = yield prisma.comments.create({
                    data: {
                        userId: userId,
                        postId: postId,
                        content: content,
                    },
                });
                yield prisma.posts.update({
                    where: { id: postId },
                    data: {
                        Comments: {
                            connect: { id: newComment.id },
                        },
                    },
                });
                res.status(201).json(newComment);
            }
            catch (err) {
                res.status(500).send("Erreur serveur");
            }
        });
    }
    static deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentId = parseInt(req.params.commentId);
                const userId = req.user.userID;
                const comment = yield prisma.comments.findUnique({
                    where: { id: commentId },
                });
                if (!comment) {
                    res.status(404).json({ msg: "Commentaire non trouvé" });
                    return;
                }
                const post = yield prisma.posts.findUnique({
                    where: { id: comment.postId },
                });
                if (!post || (comment.userId !== userId && post.id !== userId)) {
                    res
                        .status(401)
                        .json({ msg: "Vous n'êtes pas l'auteur de ce commentaire" });
                    return;
                }
                yield prisma.comments.delete({ where: { id: commentId } });
                yield prisma.posts.update({
                    where: { id: comment.postId },
                    data: {
                        Comments: {
                            disconnect: { id: commentId },
                        },
                    },
                });
                res.json({ msg: "Commentaire supprimé" });
            }
            catch (err) {
                res.status(500).send("Erreur serveur");
            }
        });
    }
    static getPostComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = parseInt(req.params.postId);
                const post = yield prisma.posts.findUnique({
                    where: { id: postId },
                    include: { Comments: true },
                });
                if (!post) {
                    res.status(404).json({ msg: "Post non trouvé" });
                    return;
                }
                res.json(post.Comments);
            }
            catch (err) {
                res.status(500).send("Erreur serveur");
            }
        });
    }
}
