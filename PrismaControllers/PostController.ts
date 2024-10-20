import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { log } from "console";

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
        return res
          .status(403)
          .json({ error: "Seuls les tailleurs peuvent créer des posts." });
      }

      const { modelId, description, titre } = req.body;

      if (!modelId || !description || !titre) {
        return res
          .status(400)
          .json({
            error: "Tous les champs (modelId, description, titre) sont requis.",
          });
      }

      const modelExists = await prisma.models.findUnique({
        where: { id: modelId },
      });

      if (!modelExists) {
        return res
          .status(404)
          .json({ error: "Le modèle spécifié n'existe pas." });
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
          },
        });

        await prisma.users.update({
          where: { id: utilisateurId },
          data: { credits: { decrement: 1 } },
        });

        // Envoyer des notifications aux abonnés du tailleur
        await this.notifyFollowers(utilisateurId, createdPost.id);

        res
          .status(201)
          .json({ message: "Post créé avec succès", post: createdPost });
      } else {
        res
          .status(403)
          .json({
            error:
              "Vous n'avez pas assez de crédits pour poster. Veuillez recharger votre compte.",
          });
      }
    } catch (error) {
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  static async getPosts(req: Request, res: Response) {
    try {
      const posts = await prisma.posts.findMany({
        include: {
          Models: true,
          Users: true,
        },
      });

      // Ajout du comptage des likes pour chaque post
      const postsWithLikesAndComments = await Promise.all(
        posts.map(async (post) => {
          const likeCount = await prisma.likes.count({
            where: { postId: post.id },
          });

          
          return {
            ...post,
            likeCount,  // Ajoute le nombre de likes au post
            //comments: post.Comments,  // Les commentaires sont déjà inclus
          };
        })
      );

      res.status(200).json(postsWithLikesAndComments);

    } catch (error) {
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  static async getPostById(req: Request, res: Response) {
    const { postId } = req.params;

    try {
      // Récupérer le post par son ID avec Prisma
      const postData = await prisma.posts.findUnique({
        where: { id: parseInt(postId) },
      });

      // Vérifier si le post existe
      if (!postData) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Retourner le post récupéré
      res.status(200).json(postData);
    } catch (error) {
      res.status(500).json({ error: "Erreur interne du serveur" });
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
        return res
          .status(403)
          .json({ error: "Vous n'êtes pas autorisé à supprimer ce post." });
      }

      // Suppression du post
      await prisma.posts.delete({
        where: { id: parseInt(postId) },
      });

      res.status(200).json({ message: "Post supprimé avec succès." });
    } catch (error) {
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  }

  static async addView(req: Request, res: Response) {
    const { postId } = req.params;

    try {
      const post = await prisma.posts.update({
        where: { id: parseInt(postId) },
        data: { vues: { increment: 1 } },
      });

      if (!post) {
        return res.status(404).json({ error: "Post non trouvé." });
      }

      res.status(200).json({ message: "Vue ajoutée avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  static async getVues(req: Request, res: Response) {
    const { postId } = req.params;

    try {
      // Récupérer le post avec le nombre de vues
      const postData = await prisma.posts.findUnique({
        where: { id: parseInt(postId) },
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
      res.status(500).json({ error: "Erreur interne du serveur" });
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
          userId: utilisateurId,
        },
      });

      if (favorisExists) {
        return res
          .status(400)
          .send("Ce post est déjà dans vos favoris.");
      }

      // Ajouter le post aux favoris
      const favoris = await prisma.favoris.create({
        data: {
          createDate: new Date(), // Utiliser la date actuelle
          postId: parseInt(postId),
          userId: utilisateurId,
        },
      });

      return res
        .status(201)
        .send("Post ajouté aux favoris");
    }
     catch (error) {
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  static async getUserFavorites(req: Request, res: Response) {
    const userId = req.user!.userID; // Assuming you have middleware that sets req.user
    
    try {
      const favorites = await prisma.favoris.findMany({
        where: {
          userId: userId
        },
        include: {
          Posts: {
            select: {
              id: true,
              description: true,
              datePublication: true,
              // Add any other post fields you want to include
            }
          }
        }, 
        orderBy: {
          createDate: 'desc'
        }
      });
  
      res.status(200).json(favorites);
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      res.status(500).send('Une erreur est survenue lors de la récupération des favoris.');
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
          userId: utilisateurId,
        },
      });

      if (!favoris) {
        return res.status(404).json({ error: "Favori non trouvé." });
      }

      // Supprimer le favori
      await prisma.favoris.delete({
        where: { id: favoris.id }, // Utiliser l'ID unique du favori
      });

      res.status(200).json({ message: "Favori supprimé avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression du favori:", error); // Pour débogage
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  static async partagerPost(req: Request, res: Response) {
    const { postId } = req.params;
    const utilisateurId = req.user!.userID;
    const { utilisateurCible } = req.body;

    try {
      // Vérifier si le post existe
      const postData = await prisma.posts.findUnique({
        where: { id: parseInt(postId) },
      });

      if (!postData) {
        return res.status(404).json({ error: "Post non trouvé." });
      }

      // Vérifier si l'utilisateur cible existe
      const utilisateurCibleData = await prisma.users.findUnique({
        where: { id: utilisateurCible },
      });

      if (!utilisateurCibleData) {
        return res.status(404).json({ error: "Utilisateur cible non trouvé." });
      }

      // Créer un enregistrement de partage
      const donneePartage = await prisma.partages.create({
        data: {
          postId: parseInt(postId),
          receiverId: utilisateurCible,
          senderId: utilisateurId,
          sharedAt: new Date(),
        },
      });

      if (!donneePartage) {
        return res.status(500).json({ error: "Échec du partage du post." });
      }

      res.status(200).json({
        message: "Post partagé avec succès.",
        partage: donneePartage,
      });
    } catch (error) {
      console.error("Erreur lors du partage du post:", error); // Pour débogage
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  static async notifyFollowers(userId: number, postId: number) {
    try {
      // Récupérer les détails de l'utilisateur et ses abonnés
      const userData = await prisma.users.findUnique({
        where: { id: userId },
        include: {
          Followers_Followers_userIdToUsers: {
            include: {
              Users_Followers_followerIdToUsers: true,
            },
          },
        },
      });

      if (!userData || !userData.Followers_Followers_userIdToUsers) {
        console.error(
          "Utilisateur ou abonnés non trouvés pour la notification"
        );
        return;
      }

      // Créer des notifications pour chaque abonné
      const notifications = userData.Followers_Followers_userIdToUsers.map(
        (followerRelation) => ({
          userId: followerRelation.followerId,
          message: `L'utilisateur ${userData.nom} a créé un nouveau post.`,
          postId: postId,
        })
      );

      // Enregistrer les notifications dans la base de données
      await prisma.usersNotifications.createMany({
        data: notifications,
      });
    } catch (error) {
      console.error("Erreur lors de la notification des abonnés:", error);
    }
  }

  static async deleteNotification(req: Request, res: Response) {
    const { notificationId } = req.params;
    const utilisateurId = req.user!.userID;

    try {
      // Vérifier si la notification existe et appartient à l'utilisateur connecté
      const notification = await prisma.usersNotifications.findUnique({
        where: { id: parseInt(notificationId) },
      });

      if (!notification) {
        return res.status(404).json({ error: "Notification non trouvée." });
      }

      if (notification.userId !== utilisateurId) {
        return res
          .status(403)
          .json({
            error:
              "Vous n'avez pas la permission de supprimer cette notification.",
          });
      }

      // Supprimer la notification
      await prisma.usersNotifications.delete({
        where: { id: parseInt(notificationId) },
      });

      res.status(200).json({ message: "Notification supprimée avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  static async getNotifications(req: Request, res: Response) {
    const utilisateurId = req.user!.userID;

    try {
      // Récupérer toutes les notifications de l'utilisateur
      const notifications = await prisma.usersNotifications.findMany({
        where: { userId: utilisateurId },
        orderBy: { createdAt: "desc" }, // Ordre décroissant par date de création
      });

      if (notifications.length === 0) {
        return res
          .status(404)
          .json({
            message: "Aucune notification trouvée pour cet utilisateur.",
          });
      }

      res.status(200).json({ notifications });
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }
}
