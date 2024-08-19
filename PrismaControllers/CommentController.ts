import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CommentController {
    static async addComment(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.userID;
            const postId = parseInt(req.params.postId);
            const content = req.body.content;

            if (!content) {
                res.status(400).json({ msg: 'Le contenu du commentaire est requis' });
                return;
            }

            const user = await prisma.users.findUnique({ where: { id: userId } });
            const post = await prisma.posts.findUnique({ where: { id: postId } });

            if (!post) {
                res.status(404).json({ msg: 'Post non trouvé' });
                return;
            }

            const newComment = await prisma.comments.create({
                data: {
                    userId: userId,
                    postId: postId,
                    content: content
                }
            });

            await prisma.posts.update({
                where: { id: postId },
                data: {
                    Comments: {
                        connect: { id: newComment.id }
                    }
                }
            });

            res.status(201).json(newComment);
        } catch (err) {
            res.status(500).send('Erreur serveur');
        }
    }

    static async deleteComment(req: Request, res: Response): Promise<void> {
        try {
            const commentId = parseInt(req.params.commentId);
            const userId = req.user!.userID;

            const comment = await prisma.comments.findUnique({ where: { id: commentId } });

            if (!comment) {
                res.status(404).json({ msg: 'Commentaire non trouvé' });
                return;
            }

            const post = await prisma.posts.findUnique({ where: { id: comment.postId } });

            if (!post || (comment.userId !== userId && post.id !== userId)) {
                res.status(401).json({ msg: 'Vous n\'êtes pas l\'auteur de ce commentaire' });
                return;
            }

            await prisma.comments.delete({ where: { id: commentId } });

            await prisma.posts.update({
                where: { id: comment.postId },
                data: {
                    Comments: {
                        disconnect: { id: commentId }
                    }
                }
            });

            res.json({ msg: 'Commentaire supprimé' });
        } catch (err) {
            res.status(500).send('Erreur serveur');
        }
    }

    static async getPostComments(req: Request, res: Response): Promise<void> {
        try {
            const postId = parseInt(req.params.postId);

            const post = await prisma.posts.findUnique({
                where: { id: postId },
                include: { Comments: true }
            });

            if (!post) {
                res.status(404).json({ msg: 'Post non trouvé' });
                return;
            }

            res.json(post.Comments);
        } catch (err) {
            res.status(500).send('Erreur serveur');
        }
    }
}

// Exporter les fonctions individuellement
export const addComment = CommentController.addComment;
export const deleteComment = CommentController.deleteComment;
export const getPostComments = CommentController.getPostComments;
