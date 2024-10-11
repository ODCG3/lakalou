import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class MessagesDiscussionController {
  static async createDiscussion(req: Request, res: Response) {
    try {
      const { receiverId } = req.body;
      const userId = req.user!.userID; // Assurez-vous que req.user.userID est correctement défini

      if (!receiverId) {
        return res.status(400).json({ message: "L'ID du receveur est requis" });
      }

      const receiverIdNumber = parseInt(receiverId);

      if (receiverIdNumber === userId) {
        return res.status(402).json({
          message: "Vous ne pouvez pas créer une discussion avec vous-même",
        });
      }

      const existingDiscussion = await prisma.usersDiscussions.findFirst({
        where: {
          OR: [
            { userId, receiverId: receiverIdNumber },
            { userId: receiverIdNumber, receiverId: userId },
          ],
        },
      });

      if (existingDiscussion) {
        return res
          .status(403)
          .json({ message: "Une discussion avec cet utilisateur existe déjà" });
      }

      const discussion = await prisma.usersDiscussions.create({
        data: {
          userId,
          receiverId: receiverIdNumber,
        },
      });

      res
        .status(201)
        .json({ message: "Discussion créée avec succès", discussion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  }

  static async getDiscussions(req: Request, res: Response) {
    try {
      const userId = req.user!.userID;

      const discussions = await prisma.usersDiscussions.findMany({
        where: {
          OR: [{ userId }, { receiverId: userId }],
        },
        include: {
          Users_UsersDiscussions_receiverIdToUsers: true,
          UsersDiscussionsMessages: true,
          Users_UsersDiscussions_userIdToUsers: true,
        },
      });

      res.status(200).json(discussions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  }

  static async getDiscussionsByUser(req: Request, res: Response) {
    try {
      const receiverId = parseInt(req.params.userId);
      const userId = req.user!.userID;

      const discussions = await prisma.usersDiscussions.findMany({
        where: {
          OR: [
            { userId, receiverId },
            { userId: receiverId, receiverId: userId },
          ],
        },
        include: {
          Users_UsersDiscussions_receiverIdToUsers: true,
          Users_UsersDiscussions_userIdToUsers: true,
        },
      });

      res.status(200).json(discussions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  }

  static async sendMessageToDiscussion(req: Request, res: Response) {
    try {
      const discussionUserId = parseInt(req.params.discussionUser);
      const userId = req.user!.userID;
      const { messageContent } = req.body;

      // Vérifier si le message est vide ou ne contient que des espaces
      if (!messageContent || messageContent.trim() === "") {
        return res
          .status(400)
          .json({ message: "Le message ne peut pas être vide" });
      }

      const discussion = await prisma.usersDiscussions.findFirst({
        where: {
          OR: [
            { userId, receiverId: discussionUserId },
            { userId: discussionUserId, receiverId: userId },
          ],
        },
      });

      if (!discussion) {
        return res.status(404).json({ message: "Discussion non trouvée" });
      }

      const message = await prisma.usersDiscussionsMessages.create({
        data: {
          content: messageContent,
          senderId: userId,
          discussionId: discussion.id,
        },
      });

      res.status(201).json({ message: "Message envoyé avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  }

  static async deleteMessage(req: Request, res: Response) {
    try {
      const userId = req.user!.userID;
      const discussionId = parseInt(req.params.discussionId);
      const messageId = parseInt(req.params.messageId);

      const discussion = await prisma.usersDiscussions.findFirst({
        where: { id: discussionId, OR: [{ userId }, { receiverId: userId }] },
      });

      if (!discussion) {
        return res.status(404).json({ message: "Discussion non trouvée" });
      }

      const message = await prisma.usersDiscussionsMessages.delete({
        where: {
          id: messageId,
          discussionId: discussion.id,
        },
      });

      res.status(200).json({ message: "Message supprimé avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  }

  static async modifierMessages(req: Request, res: Response) {
    try {
      const userId = req.user!.userID;
      const discussionId = parseInt(req.params.discussionId);
      const messageId = parseInt(req.params.messageId);
      const newContent = req.body.newContent;

      // Vérifier si le nouveau contenu est vide ou ne contient que des espaces
      if (!newContent || newContent.trim() === "") {
        return res
          .status(400)
          .json({ message: "Aucune modification enregistrée" });
      }

      const discussion = await prisma.usersDiscussions.findFirst({
        where: { id: discussionId, OR: [{ userId }, { receiverId: userId }] },
      });

      if (!discussion) {
        return res.status(404).json({ message: "Discussion non trouvée" });
      }

      const message = await prisma.usersDiscussionsMessages.updateMany({
        where: {
          id: messageId,
          discussionId: discussion.id,
        },
        data: {
          content: newContent,
        },
      });

      res.status(200).json({ message: "Message modifié avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  }
}
