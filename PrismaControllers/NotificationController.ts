import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class NotificationController {
  // Créer une notification
  static async createNotification(userId: number, action: string, message: string, postId?: number): Promise<void> {
    try {
      // Créer la notification pour l'utilisateur
      await prisma.usersNotifications.create({
        data: {
          userId: userId,
          action: action,
          message: message,
          postId: postId ?? null, // Si postId est undefined, le mettre à null
          read: false,
        },
      });

      // Notifier les abonnés
      if (postId) {
        await NotificationController.notifyFollowers(userId, postId);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la notification", error);
    }
  }

  // Récupérer les notifications d'un utilisateur
  static async getNotifications(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userID; // Récupérer l'utilisateur connecté
    try {
      const notifications = await prisma.usersNotifications.findMany({
        where: { userId: userId },
        orderBy: { createdAt: "desc" }, // Trier par ordre décroissant
      });
      res.status(200).json({ notifications });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des notifications" });
    }
  }

  // Marquer une notification comme lue
  static async markAsRead(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.params;
    try {
      await prisma.usersNotifications.update({
        where: { id: Number(notificationId) }, // Convertir l'ID en nombre
        data: { read: true },
      });
      res.status(200).json({ message: "Notification marquée comme lue" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la notification" });
    }
  }

  // Notifier les abonnés
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
        console.error("Utilisateur ou abonnés non trouvés pour la notification");
        return;
      }

      // Créer des notifications pour chaque abonné
      const notifications = userData.Followers_Followers_userIdToUsers.map(
        (followerRelation) => ({
          userId: followerRelation.followerId,
          message: `L'utilisateur ${userData.nom} a créé un nouveau post.`,
          postId: postId,
          read: false, // Notification non lue par défaut
          action: 'post_created', // Indiquer l'action
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
}


