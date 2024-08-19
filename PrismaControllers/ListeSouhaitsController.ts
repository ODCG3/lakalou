import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default class ListeSouhaitsController{
    static async listeSouhaits(req: Request, res: Response) {
        try {
          // Vérifier si l'utilisateur est connecté
          const connectedUser = await prisma.users.findUnique({
              where: { id: req.user!.userID },
          });
    
          if (!connectedUser) {
              return res.status(400).json({ message: "Vous n'êtes pas connecté" });
          }
    
          // Vérifier si le post existe
          const post = await prisma.posts.findUnique({
              where: { id: parseInt(req.params.id, 10) },
          });
    
          if (!post) {
              return res.status(400).json({ message: "Ce Post n'est pas accessible !" });
          }
    
          // Vérifier si le post appartient à l'utilisateur connecté
          if (post.utilisateurId === connectedUser.id) {
              return res.status(400).json({ message: "Vous ne pouvez pas ajouter votre propre post à la liste des souhaits" });
          }
    
          // Vérifier si le modèle du post existe
          const wishedModel = await prisma.models.findUnique({
              where: { id: post.modelId },
          });
    
          if (!wishedModel) {
              return res.status(500).json({ message: "Erreur récupération modèle du post" });
          }
    
          // Vérifier si le modèle est déjà dans la liste des souhaits
          const existingWish = await prisma.listeSouhaits.findFirst({
              where: {
                  userId: connectedUser.id,
                  postId: post.id,
              },
          });
    
          if (existingWish) {
              return res.status(400).json({ message: "Ce modèle est déjà dans votre liste des souhaits" });
          } else {
              // Ajouter le modèle à la liste des souhaits
              await prisma.listeSouhaits.create({
                  data: {
                      userId: connectedUser.id,
                      postId: post.id,
                  },
              });
    
              return res.status(201).json({ message: "Modèle ajouté à la liste des souhaits avec succès" });
          }
        } catch (err) {
            return res.status(500).json({ message: "Erreur lors de la récupération du modèle du post : " + err });
        }
    }


    static async voirListeSouhaits(req: Request, res: Response) {
        try {
            // Vérifier si l'utilisateur est connecté
            const connectedUser = await prisma.users.findUnique({
                where: { id: req.user!.userID },
            });
    
            if (!connectedUser) {
                return res.status(400).json({ message: "Vous n'êtes pas connecté" });
            }
    
            // Récupérer la liste des souhaits de l'utilisateur connecté
            const listeSouhaits = await prisma.listeSouhaits.findMany({
                where: { userId: connectedUser.id },
                include: {
                    Posts: true, // Inclure les détails des posts
                },
            });
    
            if (listeSouhaits.length === 0) {
                return res.status(200).json({ message: "Votre liste de souhaits est vide." });
            }
    
            // Renvoyer la liste des souhaits
            return res.status(200).json(listeSouhaits);
        } catch (err) {
            return res.status(500).json({ message: "Erreur lors de la récupération de la liste des souhaits : " + err });
        }
    }
    
}