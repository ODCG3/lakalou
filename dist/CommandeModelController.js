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
export default class CommandeModelController {
    // Créer une commande d'un modèle dans un post ou une story
    static createCommande(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { adresseLivraison, articles, dateLivraison } = req.body;
                const userId = req.user.userID; // Assurez-vous que req.user.userID est correctement défini
                const { postId, storyId } = req.params;
                let modelId = null;
                let ownerId = null;
                let post = null;
                let story = null;
                let article = articles !== null && articles !== void 0 ? articles : [];
                // Vérifier si c'est un post ou une story
                if (postId && !storyId) {
                    // Gérer la commande à partir d'un post
                    post = yield prisma.posts.findUnique({
                        where: { id: parseInt(postId) },
                    });
                    if (!post) {
                        return res.status(400).json({ message: "Post non trouvé" });
                    }
                    // Vérifier si le modèle existe dans le post
                    modelId = post.modelId;
                    if (!modelId) {
                        return res
                            .status(402)
                            .json({ message: "Modèle non trouvé dans le post" });
                    }
                    // Empêcher un utilisateur de commander sur son propre post
                    if (post.utilisateurId === userId) {
                        return res.status(403).json({
                            message: "Vous ne pouvez pas commander sur votre propre post",
                        });
                    }
                    ownerId = post.utilisateurId;
                }
                else if (!postId && storyId) {
                    // Gérer la commande à partir d'une story
                    story = yield prisma.stories.findUnique({
                        where: { id: parseInt(storyId) },
                    });
                    if (!story) {
                        return res.status(404).json({ message: "Story non trouvée" });
                    }
                    // Vérifier si le modèle existe dans la story
                    modelId = story.modelId;
                    if (!modelId) {
                        return res
                            .status(404)
                            .json({ message: "Modèle non trouvé dans la story" });
                    }
                    // Empêcher un utilisateur de commander sur sa propre story
                    if (story.userId === userId) {
                        return res.status(403).json({
                            message: "Vous ne pouvez pas commander sur votre propre story",
                        });
                    }
                    ownerId = story.userId;
                }
                else {
                    if (articles.length < 1) {
                        return res.status(400).json({
                            message: "Veuillez spécifier soit un postId, soit un storyId ou un tableau d'article mais pas les deux ou aucun.",
                        });
                    }
                }
                // Mettre à jour la quantité du modèle
                if (modelId) {
                    yield prisma.models.update({
                        where: { id: modelId },
                        data: { quantite: { decrement: 1 } },
                    });
                    // Vérifier la disponibilité du modèle
                    const model = yield prisma.models.findUnique({
                        where: { id: modelId },
                    });
                    if (!model || model.quantite <= 0) {
                        return res
                            .status(500)
                            .json({ message: "Le modèle n'est plus disponible" });
                    }
                    // Mise à jour des modèles de l'utilisateur (MesModels)
                    const existingMesModel = yield prisma.mesModels.findUnique({
                        where: { userId_modelId: { userId, modelId } },
                    });
                    if (!existingMesModel) {
                        yield prisma.mesModels.create({
                            data: {
                                userId,
                                modelId,
                            },
                        });
                    }
                    // Mise à jour ou création dans UsersMesModels
                    const existingUsersMesModel = yield prisma.usersMesModels.findFirst({
                        where: { userId, modelId },
                    });
                    if (existingUsersMesModel) {
                        yield prisma.usersMesModels.update({
                            where: { id: existingUsersMesModel.id },
                            data: { nombreDeCommande: { increment: 1 } },
                        });
                    }
                    else {
                        yield prisma.usersMesModels.create({
                            data: {
                                userId,
                                modelId,
                                nombreDeCommande: 1,
                            },
                        });
                    }
                }
                else {
                    articles.forEach((article) => __awaiter(this, void 0, void 0, function* () {
                        // Vérifier la disponibilité de l'article
                        const articleModel = yield prisma.articles.findUnique({
                            where: { id: article.id },
                        });
                        if (!articleModel || articleModel.quantite <= 0) {
                            return res.status(500).json({
                                message: `L'article ${articleModel === null || articleModel === void 0 ? void 0 : articleModel.libelle} n'est plus disponible, commande annulee`,
                            });
                        }
                    }));
                    articles.forEach((article) => __awaiter(this, void 0, void 0, function* () {
                        // Mettre à jour la quantité de l'article
                        yield prisma.articles.update({
                            where: { id: article.id },
                            data: { quantite: { decrement: article.quantite } },
                        });
                    }));
                }
                // Créer la commande
                const commande = yield prisma.commandeModels.create({
                    data: {
                        userId,
                        postId: postId ? parseInt(postId) : null,
                        storyId: storyId ? parseInt(storyId) : null,
                        modelID: (_a = modelId) !== null && _a !== void 0 ? _a : null,
                        adresseLivraison: adresseLivraison,
                        dateLivraison: new Date(dateLivraison),
                        articles: {
                            connect: article.map((article) => ({
                                id: parseInt(article.id), // Ensure that the ID is parsed as an integer
                            })),
                        },
                    },
                });
                let montant = 0;
                if (articles && articles.length > 0) {
                    const articlesPrices = yield Promise.all(articles.map((article) => __awaiter(this, void 0, void 0, function* () {
                        const data = yield prisma.articles.findUnique({
                            where: { id: article.id },
                        });
                        const prixTotal = data.prix * article.quantite;
                        return prixTotal;
                    })));
                    montant = parseFloat(articlesPrices.reduce((acc, curr) => acc + curr, 0));
                }
                else {
                    const model = yield prisma.models.findUnique({
                        where: { id: modelId },
                    });
                    montant = model.prix;
                }
                console.log(montant);
                yield prisma.payment.create({
                    data: {
                        libelle: `payement de la commande ${commande.id}`,
                        montant: montant / 2,
                        commandeIdid: commande.id,
                    },
                });
                // Réponse
                res.status(201).json(commande);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur serveur : " + error });
            }
        });
    }
    // Récupérer toutes les commandes d'un post ou d'une story
    static getCommandes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, storyId } = req.params;
                if (postId) {
                    const commandes = yield prisma.commandeModels.findMany({
                        where: { postId: parseInt(postId) },
                    });
                    if (commandes.length === 0) {
                        return res
                            .status(404)
                            .json({ message: "Aucune commande trouvée pour ce post." });
                    }
                    return res.json(commandes);
                }
                else if (storyId) {
                    const commandes = yield prisma.commandeModels.findMany({
                        where: { storyId: parseInt(storyId) },
                    });
                    if (commandes.length === 0) {
                        return res
                            .status(404)
                            .json({ message: "Aucune commande trouvée pour cette story." });
                    }
                    return res.json(commandes);
                }
                else {
                    return res.status(400).json({
                        message: "Veuillez spécifier soit un postId, soit un storyId.",
                    });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur serveur : " + error });
            }
        });
    }
    // Récupérer une commande par son id
    static getCommandeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commandeId = parseInt(req.params.commandeId);
                const commande = yield prisma.commandeModels.findUnique({
                    where: { id: commandeId },
                });
                if (!commande) {
                    return res.status(404).json({ message: "Commande non trouvée" });
                }
                res.json(commande);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Erreur serveur : " + error });
            }
        });
    }
}
