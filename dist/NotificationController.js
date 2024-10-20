var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
class NotificationController {
    // Créer une notification
    static createNotification(userId, action, message, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Créer la notification pour l'utilisateur
                yield prisma.usersNotifications.create({
                    data: {
                        userId: userId,
                        action: action,
                        message: message,
                        postId: postId !== null && postId !== void 0 ? postId : null, // Si postId est undefined, le mettre à null
                        read: false,
                    },
                });
                // Notifier les abonnés
                if (postId) {
                    yield NotificationController.notifyFollowers(userId, postId);
                }
            }
            catch (error) {
                console.error("Erreur lors de la création de la notification", error);
            }
        });
    }
    // Récupérer les notifications d'un utilisateur
    static getNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userID; // Récupérer l'utilisateur connecté
            try {
                const notifications = yield prisma.usersNotifications.findMany({
                    where: { userId: userId },
                    orderBy: { createdAt: "desc" }, // Trier par ordre décroissant
                });
                res.status(200).json({ notifications });
            }
            catch (error) {
                res.status(500).json({ error: "Erreur lors de la récupération des notifications" });
            }
        });
    }
    // Marquer une notification comme lue
    static markAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { notificationId } = req.params;
            try {
                yield prisma.usersNotifications.update({
                    where: { id: Number(notificationId) }, // Convertir l'ID en nombre
                    data: { read: true },
                });
                res.status(200).json({ message: "Notification marquée comme lue" });
            }
            catch (error) {
                res.status(500).json({ error: "Erreur lors de la mise à jour de la notification" });
            }
        });
    }
    // Notifier les abonnés
    static notifyFollowers(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Récupérer les détails de l'utilisateur et ses abonnés
                const userData = yield prisma.users.findUnique({
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
                const notifications = userData.Followers_Followers_userIdToUsers.map((followerRelation) => ({
                    userId: followerRelation.followerId,
                    message: `L'utilisateur ${userData.nom} a créé un nouveau post.`,
                    postId: postId,
                    read: false, // Notification non lue par défaut
                    action: 'post_created', // Indiquer l'action
                }));
                // Enregistrer les notifications dans la base de données
                yield prisma.usersNotifications.createMany({
                    data: notifications,
                });
            }
            catch (error) {
                console.error("Erreur lors de la notification des abonnés:", error);
            }
        });
    }
}
export default NotificationController;
