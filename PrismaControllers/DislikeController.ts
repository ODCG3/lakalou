import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Disliker un post qui n'a ni été liké, ni disliké
export const dislikePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const userId = req.user!.userID;

        const existingDislike = await prisma.dislikes.findFirst({
            where: {
                userId: userId,
                postId: parseInt(postId, 10),
            },
        });

        if (existingDislike) {
            res.status(400).json({ message: 'Vous avez déjà disaimé ce post.' });
            return;
        }

        const dislike = await prisma.dislikes.create({
            data: {
                userId: userId,
                postId: parseInt(postId, 10),
            },
        });

        res.status(201).json({ message: 'Post disaimé avec succès.', dislike });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error });
    }
};

// Retirer un dislike
export const undislikePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId, dislikeID } = req.params;
        const userId = req.user!.userID;

        const dislikeExist = await prisma.dislikes.findUnique({
            where: { id: parseInt(dislikeID, 10) },
        });

        if (!dislikeExist) {
            res.status(400).json({ message: 'Vous n\'avez pas disaimé ce post.' });
            return;
        }

        const dislike = await prisma.dislikes.delete({
            where: { id: parseInt(dislikeID, 10) },
        });

        res.status(200).json({ message: 'Dislike retiré avec succès.', dislike });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error });
    }
};

// Récupérer tous les dislikes d'un post
export const getPostDislike = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;

        const dislikes = await prisma.dislikes.findMany({
            where: { postId: parseInt(postId, 10) },
        });

        res.status(200).json({ dislikes });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error });
    }
};
