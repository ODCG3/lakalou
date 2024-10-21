import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// import NotificationController from './NotificationController';
import NotificationController from './NotificationController.js';  // Notez l'extension .js



const prisma = new PrismaClient();

export default class LikeController {
  // Ajouter un like
  static async likePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const userId = req.user!.userID;
  
      // Vérifier si le post existe
      const post = await prisma.posts.findUnique({
        where: { id: parseInt(postId, 10) },
      });
  
      if (!post) {
        res.status(404).json({ message: "Le post n'existe pas." });
      }
  
      // Vérifier si le like existe déjà
      const existingLike = await prisma.likes.findFirst({
        where: {
          userId: userId,
          postId: parseInt(postId, 10),
        },
      });
  
      if (existingLike) {
        res.status(400).json({ message: "Vous avez déjà aimé ce post." });
      }
  
      // Créer un nouveau like
      const like = await prisma.likes.create({
        data: {
          userId: userId,
          postId: parseInt(postId, 10),
        },
      });
      
       // Récupérer l'ID de l'utilisateur qui a publié le post
    const postAuthorId = post.utilisateurId;

    // Créer la notification pour l'auteur du post
    const notificationMessage = `L'utilisateur avec l'ID ${userId} a aimé votre post.`;
    await NotificationController.createNotification(
      postAuthorId,
      'post_liked',
      notificationMessage,
      parseInt(postId) // ID du post associé
    );
  
      res.status(201).json({ message: "Post aimé avec succès.", like });
    } catch (error) {
      res.status(500).json({ message: "Erreur du serveur.", error });
    }
  }
  



// Retirer un like
static async unlikePost(req: Request,res: Response): Promise<void> {
  try {
    const { postId, likeID } = req.params;
    const userId = req.user!.userID;

    const likeExist = await prisma.likes.findUnique({
      where: { id: parseInt(likeID, 10) },
    });

    if (!likeExist) {
      res.status(400).json({ message: "Vous n'avez pas aimé ce post." });
      return;
    }

    // Supprimer le like
    const like = await prisma.likes.delete({
      where: { id: parseInt(likeID, 10) },
    });

    // Mettre à jour le nombre de likes sur le post
    const post = await prisma.posts.update({
      where: { id: parseInt(postId, 10) },
      data: {
        Likes: {
          disconnect: { id: userId },
        },
      },
    });

    // Récupérer l'ID de l'utilisateur qui a publié le post
    const postAuthorId = post.utilisateurId;

    // Créer la notification pour l'auteur du post
    const notificationMessage = `L'utilisateur avec l'ID ${userId} a retiré son like de votre post.`;
    await NotificationController.createNotification(
      postAuthorId,
      'post_unliked',
      notificationMessage,
      parseInt(postId) // ID du post associé
    );

    res
      .status(200)
      .json({ message: "Like retiré avec succès.", data: { like, post } });
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur.", error });
  }
};




// Récupérer tous les likes d'un post
static   async getPostLikes(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { postId } = req.params;

    const likes = await prisma.likes.findMany({
      where: { postId: parseInt(postId, 10) },
    });

    res.status(200).json({ likes });
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur.", error });
  }
};
}