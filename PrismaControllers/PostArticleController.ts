import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class PostArticleController {
    static async createPostArticle(req: Request, res: Response) {
        try {
            const utilisateurId = req.user?.userID;
            const { description } = req.body;
            const articleId = req.params.articleId; // Récupération de l'articleId depuis l'URL

            if (!utilisateurId || !articleId || !description) {
                return res.status(400).json({ error: "Tous les champs sont obligatoires." });
            }

            const connectedUser = await prisma.users.findUnique({
                where: { id: utilisateurId },
            });

            if (!connectedUser) {
                return res.status(404).json({ error: "Utilisateur non trouvé." });
            }

            if (connectedUser.role !== "vendeur") {
                return res.status(403).json({ error: "Seuls les vendeurs peuvent poster des articles." });
            }

            // Vérifiez si l'article existe déjà
            const article = await prisma.articles.findUnique({
                where: { id: Number(articleId) }, // Assurez-vous que articleId est bien un nombre
            });

            if (!article) {
                return res.status(404).json({ error: "Article non trouvé." });
            }

            // Créer un nouveau post d'article
            const newPostArticle = await prisma.posts.create({
                data: {
                    utilisateurId,
                    articlesid: Number(articleId), // Assurez-vous que articlesid est bien un nombre
                    description,
                    datePublication: new Date(),
                },
            });

            res.status(201).json(newPostArticle);
        } catch (error) {
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }
}
