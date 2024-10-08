import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export default class ModelController {
  static async create(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    
    const { libelle, prix, quantite, contenu,articles } = req.body;

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
          throw new Error(
            "Invalid format: contenu must be an array of strings."
          );
        }
      } else if (Array.isArray(contenu)) {
        // Directly use `contenu` if it's already an array of strings
        
        parsedContenu = contenu;
      } else {
        throw new Error("Contenu must be a string or an array of strings.");
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid JSON format for contenu" });
      return;
    }

    try {
      const createdModel = await prisma.models.create({
        data: {
          libelle: libelle,
          prix,
          quantite,
          contenu: parsedContenu,
          tailleurID: req.user!.userID, // Assuming `req.user.userID` is the tailleur ID
          // articles:{
          //   connect: articles.map((article:any) => ({ id: article.id })),
          // }
        },
      });

      await prisma.mesModels.create({
        data: {
          modelId: createdModel.id,
          //   libelle: createdModel.libelle!,
          //   nombreDeCommande: 0,
          //   note: [],
          userId: req.user!.userID,
        },
      });

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
    const { libelle, prix, contenu } = req.body;

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
