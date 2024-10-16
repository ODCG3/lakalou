import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class LikeController {
  // Ajouter un like
  static async likePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const userId = req.user!.userID; // Récupérer l'utilisateur depuis le token

      // Vérifier si le like existe déjà
      const existingLike = await prisma.likes.findFirst({
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
      const like = await prisma.likes.create({
        data: {
          userId: userId,
          postId: parseInt(postId, 10),
        },
      });

      res.status(200).json({ message: "Post aimé avec succès.", like });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur du serveur.", error });
    }
  }

  // Retirer un like (modifié)
  static async unlikePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const userId = req.user!.userID;

      // Trouver le like correspondant à cet utilisateur et ce post
      const existingLike = await prisma.likes.findFirst({
        where: { userId, postId: parseInt(postId, 10) },
      });

      if (!existingLike) {
        res.status(400).json({ message: "Vous n'avez pas aimé ce post." });
        return;
      }

      // Supprimer le like
      await prisma.likes.delete({
        where: { id: existingLike.id },
      });

      res.status(200).json({ message: "Like retiré avec succès." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur du serveur.", error });
    }
  }
// Compter les likes d'un post
static async countPostLikes(req: Request, res: Response): Promise<void> {
  
  try {
    const { postId } = req.params;

    // Compter le nombre de likes pour le post donné
    const likeCount = await prisma.likes.count({
      where: { postId: parseInt(postId, 10) },
    });
    
    res.status(200).json({ postId: parseInt(postId, 10), likeCount });
  } catch (error) {
    console.error("Erreur lors du comptage des likes :", error);
    res.status(500).json({ message: "Erreur du serveur.", error });
  }
}

}
