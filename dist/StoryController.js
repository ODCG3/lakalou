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
const createStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours later
    const userID = req.user.userID;
    try {
        // Vérifiez si l'utilisateur est connecté
        const connectedUser = yield prisma.users.findUnique({
            where: { id: userID },
        });
        if (!connectedUser) {
            return res.status(401).json({ error: "Utilisateur non connecté" });
        }
        // Vérifiez le rôle de l'utilisateur
        if (connectedUser.role !== "tailleur" && connectedUser.role !== "vendeur") {
            return res.status(403).json({
                error: "Seuls les tailleurs ou vendeurs peuvent poster des stories",
            });
        }
        const credit = connectedUser === null || connectedUser === void 0 ? void 0 : connectedUser.credits;
        // Vérifiez si l'utilisateur a suffisamment de crédits
        if (credit <= 0) {
            return res
                .status(402)
                .json({ error: "Crédits insuffisants pour créer une story" });
        }
        const blockedUserIds = req.body.blockedUsers || []; // Liste des utilisateurs bloqués
        let storyData = {
            userId: userID,
            expiresAt: expirationTime,
            BlockedUsers: {
                connect: blockedUserIds.map((userId) => ({ id: userId })),
            },
        };
        // Selon le rôle de l'utilisateur, associez soit un modèle, soit un article
        if (connectedUser.role === "tailleur") {
            const modelID = req.body.model; // ID du modèle à associer
            const model = yield prisma.models.findFirst({
                where: { id: parseInt(modelID, 10) },
            });
            if (!model) {
                return res.status(400).json({ error: "Modèle non trouvé" });
            }
            storyData.modelId = model.id; // Associez le modèle à la story
        }
        else if (connectedUser.role === "vendeur") {
            const articleID = req.body.article; // ID de l'article à associer
            const article = yield prisma.articles.findFirst({
                where: { id: parseInt(articleID, 10) },
            });
            if (!article) {
                return res.status(400).json({ error: "Article non trouvé" });
            }
            storyData.articleId = article.id; // Associez l'article à la story
        }
        // Créez la story
        const story = yield prisma.stories.create({
            data: storyData,
        });
        // Déduisez un crédit de l'utilisateur
        yield prisma.users.update({
            where: { id: userID },
            data: {
                credits: credit - 1,
                Stories: {
                    connect: { id: story.id },
                },
            },
        });
        res.status(201).json({
            message: "Story créée avec succès!",
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});
const getStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const viewerId = req.user.userID; // User requesting to view the stories
    const ownerId = req.params.userId; // Owner of the stories
    try {
        // Fetch stories of the user while excluding those where the requesting user is blocked
        const stories = yield prisma.stories.findMany({
            where: {
                userId: parseInt(ownerId),
                expiresAt: { gt: new Date() },
                BlockedUsers: { none: { id: viewerId } }, // Exclude stories where viewerId is in the blocked users list
            },
        });
        const storys = yield prisma.stories.findMany({
            where: {
                userId: {
                    in: yield prisma.followers
                        .findMany({
                        where: {
                            followerId: viewerId,
                        },
                        select: {
                            userId: true, // Get the user IDs of users being followed
                        },
                    })
                        .then((follows) => follows.map((follow) => follow.userId)), // Extract the user IDs
                },
            },
            include: {
                Models: true, // Include any related models if needed
            },
        });
        res.status(200).json(stories);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const deleteStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storyId = parseInt(req.params.id);
    const userID = req.user.userID;
    try {
        // First, delete the story if it exists and belongs to the user
        const result = yield prisma.stories.deleteMany({
            where: {
                id: storyId,
                userId: userID,
            },
        });
        if (result.count > 0) {
            res.status(200).json({ message: "Story supprimée avec succès" });
        }
        else {
            res.status(404).json({
                message: "Story non trouvée ou vous n'êtes pas autorisé à la supprimer",
            });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const viewStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storyId = req.params.id;
    try {
        const story = yield prisma.stories.update({
            where: { id: parseInt(storyId) },
            data: { Views: { increment: 1 } },
        });
        if (story) {
            res.status(200).json({ views: story.Views });
        }
        else {
            res.status(400).json({ message: "Story non trouvée" });
        }
    }
    catch (error) {
        res.status(500).json({
            error: "Une erreur interne est survenue. Veuillez réessayer plus tard.",
        });
    }
});
const getStoryViews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storyId = req.params.id;
    try {
        const story = yield prisma.stories.findUnique({
            where: { id: parseInt(storyId) },
        });
        if (!story) {
            res.status(404).json({ message: "La story n'a pas été trouvée." });
        }
        else {
            res.status(200).json({ views: story.Views });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Une erreur interne est survenue. Veuillez réessayer plus tard.",
        });
    }
});
export default {
    createStory,
    getStories,
    deleteStory,
    viewStory,
    getStoryViews,
};
