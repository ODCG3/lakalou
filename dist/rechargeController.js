var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
import NotificationController from './NotificationController';
const prisma = new PrismaClient();
export const addRecharge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount, paymentMethod } = req.body;
    try {
        // Trouver l'utilisateur
        const user = yield prisma.users.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }
        // Créer la recharge
        const recharge = yield prisma.recharge.create({
            data: {
                amount,
                paymentMethod,
                user: { connect: { id: userId } },
            },
        });
        // Mettre à jour les crédits de l'utilisateur
        const updatedUser = yield prisma.users.update({
            where: { id: userId },
            data: {
                credits: user.credits + amount,
            },
        });
        // Récupérer l'ID de l'utilisateur qui a effectué la recharge
        const userRechargeId = userId;
        // Utiliser NotificationController pour créer la notification
        const notificationMessage = `Vous avez rechargé votre compte de ${amount} crédits avec succès!`;
        yield NotificationController.createNotification(userRechargeId, 'recharge_completed', notificationMessage);
        res.json({
            message: 'Recharge réussie',
            recharge,
            newBalance: updatedUser.credits,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});
