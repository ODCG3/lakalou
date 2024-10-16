import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ajouter un like
export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params; // Récupérer l'ID du post
    const userId = req.user!.userID; // Récupérer l'ID de l'utilisateur depuis le token

    // Vérifier si l'utilisateur a déjà liké le post
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

    // Créer un nouveau like
    const like = await prisma.likes.create({
      data: {
        userId: userId,
        postId: parseInt(postId),
      },
    });

    // Mettre à jour le nombre de likes sur le post
    const post = await prisma.posts.update({
      where: { id: parseInt(postId, 10) },
      data: {
        Likes: {
          connect: { id: userId },
        },
      },
    });

    // Envoyer un message de succès
    res.status(200).json({ message: "Post aimé avec succès.", like });
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur.", error });
  }
};

// Retirer un like
export const unlikePost = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    res
      .status(200)
      .json({ message: "Like retiré avec succès.", data: { like, post } });
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur.", error });
  }
};

// Récupérer tous les likes d'un post
export const getPostLikes = async (
  req: Request,
  res: Response
): Promise<void> => {
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
