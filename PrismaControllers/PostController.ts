import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class PostController {
    static async createPost(req: Request, res: Response) {
        try {
            const utilisateurId = req.user!.userID;
            const connectedUser = await prisma.users.findUnique({
                where: { id: utilisateurId },
            });

            if (!connectedUser) {
                return res.status(404).json({ error: "Utilisateur non trouvé." });
            }

            if (connectedUser.role !== "tailleur") {
                return res.status(403).json({ error: "Seuls les tailleurs peuvent créer des posts." });
            }

            const { modelId, description, titre } = req.body;

            if (!modelId || !description || !titre) {
                return res.status(400).json({ error: "Tous les champs (modelId, description, titre) sont requis." });
            }

            const modelExists = await prisma.models.findUnique({
                where: { id: modelId },
            });

            if (!modelExists) {
                return res.status(404).json({ error: "Le modèle spécifié n'existe pas." });
            }

            if (connectedUser?.credits! > 0) {

                const createdPost = await prisma.posts.create({
                    data: {
                        modelId,
                        utilisateurId: utilisateurId,
                        description,
                        titre,
                        datePublication: new Date(),
                        vues: 0,
                    }
                });

                await prisma.users.update({
                    where: { id: utilisateurId },
                    data: { credits: { decrement: 1 } }
                });

                res.status(201).json({ message: "Post créé avec succès", post: createdPost });
            } else {
                res.status(403).json({ error: 'Vous n\'avez pas assez de crédits pour poster. Veuillez recharger votre compte.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }

    static async getPosts(req: Request, res: Response) {
        try {
            const posts = await prisma.posts.findMany();
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }
}