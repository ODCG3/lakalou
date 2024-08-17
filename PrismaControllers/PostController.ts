import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { log } from 'console';

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

    static async getPostById(req: Request, res: Response) {
        const { postId } = req.params;
        
        try {
            // Récupérer le post par son ID avec Prisma
            const postData = await prisma.posts.findUnique({
                where: { id: parseInt(postId) }
            });
            
            // Vérifier si le post existe
            if (!postData) {
                return res.status(404).json({ error: 'Post not found' });
            }
            
            // Retourner le post récupéré
            res.status(200).json(postData);
        } catch (error) {
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }

    static async deletePost(req: Request, res: Response) {
        const { postId } = req.params;
        const utilisateurId = req.user!.userID;

        try {
            // Vérification si le post existe
            const post = await prisma.posts.findUnique({
                where: { id: parseInt(postId) },
            });
            
            if (!post) {
                return res.status(404).json({ error: "Post non trouvé." });
            }
            
            // Vérification si l'utilisateur est le créateur du post
            if (post.utilisateurId !== utilisateurId) {
                return res.status(403).json({ error: "Vous n'êtes pas autorisé à supprimer ce post." });
            }
            
            // Suppression du post
            await prisma.posts.delete({
                where: { id: parseInt(postId) },
            });

            res.status(200).json({ message: "Post supprimé avec succès." });
        } catch (error) {
            res.status(500).json({ error: 'Erreur interne du serveur.' });
        }
    }

    static async addView(req: Request, res: Response) {
        const { postId } = req.params;

        try {
            const post = await prisma.posts.update({
                where: { id: parseInt(postId) },
                data: { vues: { increment: 1 } }
            });

            if (!post) {
                return res.status(404).json({ error: "Post non trouvé." });
            }

            res.status(200).json({ message: "Vue ajoutée avec succès" });
        } catch (error) {
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }

    static async getVues(req: Request, res: Response) {
        const { postId } = req.params;
    
        try {
            // Récupérer le post avec le nombre de vues
            const postData = await prisma.posts.findUnique({
                where: { id: parseInt(postId) }
            });
    
            // Vérifier si le post existe
            if (!postData) {
                return res.status(404).json({ error: "Post not found" });
            }
    
            // Utiliser directement le nombre de vues
            const numberOfVues = postData.vues;
    
            // Retourner le nombre de vues
            res.status(200).json({ vues: numberOfVues });
        } catch (error) {
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }

    static async addFavoris(req: Request, res: Response) {
        const { postId } = req.params;
        const utilisateurId = req.user!.userID;
    
        try {
            // Vérifier si le post existe
            const postExists = await prisma.posts.findUnique({
                where: { id: parseInt(postId) },
            });
    
            if (!postExists) {
                return res.status(404).json({ error: "Post non trouvé." });
            }
    
            // Vérifier si le post est déjà dans les favoris de l'utilisateur
            const favorisExists = await prisma.favoris.findFirst({
                where: {
                    postId: parseInt(postId),
                    userId: utilisateurId
                }
            });
    
            if (favorisExists) {
                return res.status(400).json({ error: "Ce post est déjà dans vos favoris." });
            }
    
            // Ajouter le post aux favoris
            const favoris = await prisma.favoris.create({
                data: {
                    createDate: new Date(), // Utiliser la date actuelle
                    postId: parseInt(postId),
                    userId: utilisateurId
                }
            });
    
            res.status(201).json({ message: "Post ajouté aux favoris" });
        } catch (error) {
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }

    // static async getAllFavoris(req: Request, res: Response) {
    //     const utilisateurId = req.user!.userID; // Assurez-vous que req.user est défini
    //     console.log(utilisateurId);
        
    
    //     if (!utilisateurId) {
    //         return res.status(401).json({ error: "Utilisateur non authentifié." });
    //     }
    
    //     try {
    //         // Récupérer tous les favoris de l'utilisateur
    //         const favorisList = await prisma.favoris.findMany({
    //             where: { userId: utilisateurId },
    //             include: {
    //                 Posts: true // Ajoute les détails des posts si nécessaire
    //             }
    //         });
    
    //         // Vérifier si des favoris existent
    //         if (favorisList.length === 0) {
    //             return res.status(404).json({ message: "Aucun favori trouvé pour cet utilisateur." });
    //         }
    
    //         // Retourner la liste des favoris
    //         res.status(200).json({ favoris: favorisList });
    //     } catch (error) {
    //         console.log('Erreur lors de la récupération des favoris:', error); // Pour débogage
    //         res.status(500).json({ error: 'Erreur interne du serveur' });
    //     }
    // }
    
    

    static async deleteFavoris(req: Request, res: Response) {
        const { postId } = req.params;
        const utilisateurId = req.user!.userID;
    
        if (!utilisateurId) {
            return res.status(401).json({ error: "Utilisateur non authentifié." });
        }
    
        try {
            // Vérifier si le favori existe en utilisant findFirst
            const favoris = await prisma.favoris.findFirst({
                where: {
                    postId: parseInt(postId),
                    userId: utilisateurId
                }
            });
    
            if (!favoris) {
                return res.status(404).json({ error: "Favori non trouvé." });
            }
    
            // Supprimer le favori
            await prisma.favoris.delete({
                where: { id: favoris.id } // Utiliser l'ID unique du favori
            });
    
            res.status(200).json({ message: "Favori supprimé avec succès." });
        } catch (error) {
            console.error('Erreur lors de la suppression du favori:', error); // Pour débogage
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }
    

    

    
    
    
}