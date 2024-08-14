import { PrismaClient, Users } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

const createStory = async (req:Request, res:Response) => {
  const currentTime = new Date();
  const expirationTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours later
  const userID = req.user!.userID;

  try {
    const connectedUser = await prisma.users.findUnique({
      where: { id: userID }
    });

    if(!connectedUser){
        return res.status(401).json({ error: 'Utilisateur non connecté' });
    }

    if (connectedUser!.role !== "tailleur") {
      return res.status(403).json({ error: 'Vous n\'êtes pas un tailleur, seul les tailleurs peuvent poster des statuts' });
    }

    // Find the model to associate with the story (e.g., based on ID in req.body)
    const modelID = req.body.model; // Ensure the model ID is provided in the request
    const model = await prisma.models.findUnique({
      where: { id: modelID }
    });

    if (!model) {
      return res.status(400).json({ error: 'Modèle non trouvé' });
    }

    const credit = connectedUser?.credits

    if (credit! > 0) {
      const story = await prisma.stories.create({
        data: {
          userId: userID,
          modelId: model.id,
          expiresAt: expirationTime,
          BlockedUsers: req.body.BlockedUsers || []  // Get the list of blocked users from the request
        }
      });

      await prisma.users.update({
        where: { id: userID },
        data: {
          credits: credit! - 1,
          Stories: {
            connect: { id: story.id }
          }
        }
      });

      res.status(201).json({
        message: 'Story créée avec succès!'
      });
    } else {
      res.status(402).json({ error: 'Crédits insuffisants pour créer une story' });
    }
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message
    });
  }
};

const getStories = async (req:Request, res:Response) => {
  const viewerId = req.user!.userID; // User requesting to view the stories
  const ownerId = req.params.userId; // Owner of the stories

  try {
    // Fetch stories of the user while excluding those where the requesting user is blocked
    const stories = await prisma.stories.findMany({
      where: {
        userId:  parseInt(ownerId),
        expiresAt: { gt: new Date() },
        BlockedUsers: { none: { id: viewerId } }  // Exclude stories where viewerId is in the blocked users list
      }
    });

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const deleteStory = async (req:Request, res:Response) => {
  const storyId = req.params.id;
  const userID = req.user!.userID;

  try {
    const result = await prisma.stories.deleteMany({
      where: {
        id: parseInt(storyId),
        userId: userID
      }
    });

    if (result.count > 0) {
      res.status(200).json({ message: 'Story supprimée avec succès' });
    } else {
      res.status(404).json({ message: 'Story non trouvée ou vous n\'êtes pas autorisé à la supprimer' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const viewStory = async (req:Request, res:Response) => {
  const storyId = req.params.id;

  try {
    const story = await prisma.stories.update({
      where: { id: parseInt(storyId)  },
      data: { Views: { increment: 1 } }
    });

    if (story) {
      res.status(200).json({ views: story.Views });
    } else {
      res.status(400).json({ message: 'Story non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Une erreur interne est survenue. Veuillez réessayer plus tard.' });
  }
};

const getStoryViews = async (req:Request, res:Response) => {
  const storyId = req.params.id;

  try {
    const story = await prisma.stories.findUnique({
      where: { id: parseInt(storyId) }
    });

    if (!story) {
      res.status(404).json({ message: "La story n'a pas été trouvée." });
    } else {
      res.status(200).json({ views: story.Views });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Une erreur interne est survenue. Veuillez réessayer plus tard." });
  }
};

export default {
  createStory,
  getStories,
  deleteStory,
  viewStory,
  getStoryViews,
};
