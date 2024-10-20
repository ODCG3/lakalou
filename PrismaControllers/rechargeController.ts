import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import NotificationController from './NotificationController'; 

const prisma = new PrismaClient();

export const addRecharge = async (req: Request, res: Response) => {
  const { userId, amount, paymentMethod } = req.body;

  try {
    // Trouver l'utilisateur
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    // Créer la recharge
    const recharge = await prisma.recharge.create({
      data: {
        amount,
        paymentMethod,
        user: { connect: { id: userId } },
      },
    });

    // Mettre à jour les crédits de l'utilisateur
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        credits: user.credits + amount,
      },
    });

    // Récupérer l'ID de l'utilisateur qui a effectué la recharge
    const userRechargeId = userId;

    // Utiliser NotificationController pour créer la notification
    const notificationMessage = `Vous avez rechargé votre compte de ${amount} crédits avec succès!`;
    await NotificationController.createNotification(userRechargeId, 'recharge_completed', notificationMessage);

    res.json({
      message: 'Recharge réussie',
      recharge,
      newBalance: updatedUser.credits,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};
