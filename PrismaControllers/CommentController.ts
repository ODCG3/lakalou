import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class CommentController {
  static async addComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userID;
      const postId = parseInt(req.params.postId);
      const content = req.body.content;

      if (!content) {
        res.status(400).json({ msg: "Le contenu du commentaire est requis" });
        return;
      }

      const user = await prisma.users.findUnique({ where: { id: userId } });
      const post = await prisma.posts.findUnique({ where: { id: postId } });

      if (!post) {
        res.status(404).json({ msg: "Post non trouvé" });
        return;
      }

      const newComment = await prisma.comments.create({
        data: {
          userId: userId,
          postId: postId,
          content: content,
        },
      });

      await prisma.posts.update({
        where: { id: postId },
        data: {
          Comments: {
            connect: { id: newComment.id },
          },
        },
      });

      res.status(201).json(newComment);
    } catch (err) {
      res.status(500).send("Erreur serveur");
    }
  }

  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const commentId = parseInt(req.params.commentId);
      const userId = req.user!.userID;

      const comment = await prisma.comments.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        res.status(404).json({ msg: "Commentaire non trouvé" });
        return;
      }

      const post = await prisma.posts.findUnique({
        where: { id: comment.postId },
      });

      if (!post || (comment.userId !== userId && post.id !== userId)) {
        res
          .status(401)
          .json({ msg: "Vous n'êtes pas l'auteur de ce commentaire" });
        return;
      }

      await prisma.comments.delete({ where: { id: commentId } });

      await prisma.posts.update({
        where: { id: comment.postId },
        data: {
          Comments: {
            disconnect: { id: commentId },
          },
        },
      });

      res.json({ msg: "Commentaire supprimé" });
    } catch (err) {
      res.status(500).send("Erreur serveur");
    }
  }

  // Ajouter une réponse à un commentaire
  static async addReply(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.userID;
      const parentId = parseInt(req.params.commentId, 10);
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ msg: "Le contenu de la réponse est requis" });
      }

      // Vérifier si le commentaire parent existe
      const parentComment = await prisma.comments.findUnique({ where: { id: parentId } });
      if (!parentComment) {
        return res.status(404).json({ msg: "Commentaire parent non trouvé" });
      }

      // Créer la réponse
      const newReply = await prisma.comments.create({
        data: {
          content,
          userId,
          parentId,
        },
      });

      return res.status(201).json({ msg: "Réponse ajoutée avec succès", newReply });
    } catch (err) {
      console.error("Erreur lors de l'ajout de la réponse :", err);
      return res.status(500).json({ msg: "Erreur serveur", error: err });
    }
  }

  // Récupérer les commentaires d'un post avec les réponses imbriquées
  static async getPostComments(req: Request, res: Response): Promise<Response> {
    try {
      const postId = parseInt(req.params.postId, 10);

      const post = await prisma.posts.findUnique({
        where: { id: postId },
        include: {
          Comments: {
            where: { parentId: null }, // Récupère uniquement les commentaires de niveau supérieur
            include: {
              Users: { select: { nom: true, prenom: true, photoProfile: true } },
              Replies: {  // Récupère les réponses pour chaque commentaire
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

      const commentsWithReplies = post.Comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        userId: comment.userId,
        nom: comment.Users?.nom,
        prenom: comment.Users?.prenom,
        photoProfile: comment.Users?.photoProfile,
        replies: comment.Replies.map((reply) => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt,
          userId: reply.userId,
          nom: reply.Users?.nom,
          prenom: reply.Users?.prenom,
          photoProfile: reply.Users?.photoProfile,
        })),
      }));

      return res.json({ comments: commentsWithReplies });
    } catch (err) {
      console.error("Erreur lors de la récupération des commentaires :", err);
      return res.status(500).json({ msg: "Erreur serveur", error: err });
    }
  }
}
