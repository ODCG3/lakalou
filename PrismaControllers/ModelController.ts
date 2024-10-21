import { PrismaClient } from "@prisma/client";
// import NotificationController from './NotificationController'; // Ajustez le chemin selon votre structure de projet
import NotificationController from './NotificationController.js';  // Notez l'extension .js


import { Request, Response } from "express";

const prisma = new PrismaClient();

export default class ModelController {
  static async create(req: Request, res: Response): Promise<void> {
    
    let { libelle,prix , quantite, contenu,articles } = req.body;
    prix  = parseFloat(prix);
    quantite = parseInt(quantite, 10);

    console.log(prix, quantite, contenu, articles);
    


    const existingModel = await prisma.models.findFirst({
      where: { libelle: libelle },
    });
  
    if (existingModel) {
      res.status(400).json({ error: "Cet modèle est déjà utilisé" });
      return;
    }
  
    let parsedContenu: string[] = [];
    try {
      if (typeof contenu === "string") {
        parsedContenu = JSON.parse(contenu);
  
        if (
          !Array.isArray(parsedContenu) ||
          !parsedContenu.every((item) => typeof item === "string")
        ) {
          throw new Error("Invalid format: contenu must be an array of strings.");
        }
      } else if (Array.isArray(contenu)) {
        parsedContenu = contenu;
      } else {
        throw new Error("Contenu must be a string or an array of strings.");
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid JSON format for contenu" });
      return;
    }

    try {
      // Création du modèle
      const createdModel = await prisma.models.create({
        data: {
          libelle: libelle,
          prix,
          quantite,
          contenu: parsedContenu,
          tailleurID: req.user!.userID, // ID de l'utilisateur connecté
        },
      });
  
      await prisma.mesModels.create({
        data: {
          modelId: createdModel.id,
          userId: req.user!.userID,
        },
      });
  
      // Récupérer les abonnés de l'utilisateur
      const followers = await prisma.followers.findMany({
        where: { userId: req.user!.userID },
        select: { followerId: true },
      });
  
      // Créer une notification pour chaque abonné
      await Promise.all(
        followers.map(async (follower) => {
          await NotificationController.createNotification(
            follower.followerId,
            'model_created',
            `Un nouveau modèle a été créé par : ${libelle}`,
            createdModel.id // ID du modèle créé
          );
        })
      );
  
      // Créer une notification pour l'utilisateur qui a créé le modèle
      await NotificationController.createNotification(
        req.user!.userID,
        'model_created',
        `Votre modèle "${libelle}" a été créé avec succès.`,
        createdModel.id // ID du modèle créé
      );
  
      res.status(201).json(createdModel);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
  
  

  static async getModelsByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    try {
      const models = await prisma.models.findMany({
        where: {
          tailleurID: parseInt(userId, 10),
        },
        include: {
          Users: true,
          articles: true
        },
      });

      res.json(models);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getModelById(req: Request, res: Response): Promise<void> {
    const { modelId } = req.params;

    try {
      const foundModel = await prisma.models.findUnique({
        where: { id: parseInt(modelId, 10) },
        include: {
          articles: true, // Include the associated articles
        },
      });

      if (!foundModel) {
        res.status(404).json({ error: "Model not found" });
        return;
      }

      res.json(foundModel);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateModel(req: Request, res: Response): Promise<void> {
    const { modelId } = req.params;
    let { libelle,prix , quantite, contenu,articles } = req.body;
    prix  = parseFloat(prix);
    quantite = parseInt(quantite, 10);

    try {
      const updatedModel = await prisma.models.update({
        where: { id: parseInt(modelId, 10) },
        data: { libelle, prix, contenu },
      });

      if (!updatedModel) {
        res.status(404).json({ error: "Model not found" });
        return;
      }

      res.json(updatedModel);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async deleteModel(req: Request, res: Response): Promise<void> {
    const { modelId } = req.params;

    try {
      await prisma.mesModels.delete({
        where: {
            userId_modelId: {
                userId: Number(req.user!.userID),
                modelId: Number(modelId),
            },
        },
      });

      const deletedModel = await prisma.models.delete({
        where: { id: parseInt(modelId) },
      });

      if (!deletedModel) {
        res.status(404).json({ error: "Model not found" });
        return;
      }

      res.json({ message: "Model deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  //   static async noteModel(req: Request, res: Response): Promise<void> {
  //     const userId = req.user!.userID;
  //     const { modelId } = req.params;
  //     const { note } = req.body;

  //     try {
  //       const foundModel = await prisma.models.findUnique({
  //         where: { id: parseInt(modelId, 10) },
  //       });

  //       if (!foundModel) {
  //         res.status(403).json({ error: 'Model not found' });
  //         return;
  //       }

  //       const userModel = await prisma.mesModels.findFirst({
  //         where: { modelId: foundModel.id, userId: userId },
  //       });

  //       if (userModel) {
  //         const updatedNote = [...(userModel.note || []), note];
  //         await prisma.mesModels.update({
  //           where: { modelId: foundModel.id, userId: userId },
  //           data: { note: updatedNote },
  //         });
  //       } else {
  //         await prisma.mesModels.create({
  //           data: {
  //             modelId: foundModel.id,
  //             libelle: foundModel.libelle!,
  //             nombreDeCommande: 1,
  //             note: [note],
  //             userId: userId,
  //           },
  //         });
  //       }

  //       res.status(200).json({ message: 'Model noted successfully' });
  //     } catch (error) {
  //       res.status(500).json({ error: (error as Error).message });
  //     }
  //   }
}
