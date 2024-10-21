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
// import NotificationController from './NotificationController'; // Ajustez le chemin selon votre structure de projet
import NotificationController from './NotificationController.js'; // Notez l'extension .js
const prisma = new PrismaClient();
export default class ModelController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { libelle, prix, quantite, contenu, articles } = req.body;
            const existingModel = yield prisma.models.findFirst({
                where: { libelle: libelle },
            });
            if (existingModel) {
                res.status(400).json({ error: "Cet modèle est déjà utilisé" });
                return;
            }
            let parsedContenu = [];
            try {
                if (typeof contenu === "string") {
                    parsedContenu = JSON.parse(contenu);
                    if (!Array.isArray(parsedContenu) ||
                        !parsedContenu.every((item) => typeof item === "string")) {
                        throw new Error("Invalid format: contenu must be an array of strings.");
                    }
                }
                else if (Array.isArray(contenu)) {
                    parsedContenu = contenu;
                }
                else {
                    throw new Error("Contenu must be a string or an array of strings.");
                }
            }
            catch (error) {
                res.status(400).json({ error: "Invalid JSON format for contenu" });
                return;
            }
            try {
                // Création du modèle
                const createdModel = yield prisma.models.create({
                    data: {
                        libelle: libelle,
                        prix,
                        quantite,
                        contenu: parsedContenu,
                        tailleurID: req.user.userID, // ID de l'utilisateur connecté
                    },
                });
                yield prisma.mesModels.create({
                    data: {
                        modelId: createdModel.id,
                        userId: req.user.userID,
                    },
                });
                // Récupérer les abonnés de l'utilisateur
                const followers = yield prisma.followers.findMany({
                    where: { userId: req.user.userID },
                    select: { followerId: true },
                });
                // Créer une notification pour chaque abonné
                yield Promise.all(followers.map((follower) => __awaiter(this, void 0, void 0, function* () {
                    yield NotificationController.createNotification(follower.followerId, 'model_created', `Un nouveau modèle a été créé par : ${libelle}`, createdModel.id // ID du modèle créé
                    );
                })));
                // Créer une notification pour l'utilisateur qui a créé le modèle
                yield NotificationController.createNotification(req.user.userID, 'model_created', `Votre modèle "${libelle}" a été créé avec succès.`, createdModel.id // ID du modèle créé
                );
                res.status(201).json(createdModel);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static getModelsByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({ error: "User ID is required" });
                return;
            }
            try {
                const models = yield prisma.models.findMany({
                    where: {
                        tailleurID: parseInt(userId, 10),
                    },
                    include: {
                        Users: true,
                        articles: true
                    },
                });
                res.json(models);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static getModelById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { modelId } = req.params;
            try {
                const foundModel = yield prisma.models.findUnique({
                    where: { id: parseInt(modelId, 10) },
                    include: {
                        articles: true, // Include the associated articles
                    },
                });
                if (!foundModel) {
                    res.status(404).json({ error: "Model not found" });
                    return;
                }
                res.json(foundModel);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static updateModel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { modelId } = req.params;
            const { libelle, prix, contenu } = req.body;
            try {
                const updatedModel = yield prisma.models.update({
                    where: { id: parseInt(modelId, 10) },
                    data: { libelle, prix, contenu },
                });
                if (!updatedModel) {
                    res.status(404).json({ error: "Model not found" });
                    return;
                }
                res.json(updatedModel);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static deleteModel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { modelId } = req.params;
            try {
                yield prisma.mesModels.delete({
                    where: {
                        userId_modelId: {
                            userId: Number(req.user.userID),
                            modelId: Number(modelId),
                        },
                    },
                });
                const deletedModel = yield prisma.models.delete({
                    where: { id: parseInt(modelId) },
                });
                if (!deletedModel) {
                    res.status(404).json({ error: "Model not found" });
                    return;
                }
                res.json({ message: "Model deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
