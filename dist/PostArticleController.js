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
const prisma = new PrismaClient();
export default class PostArticleController {
    static createPostArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const utilisateurId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
                const { description } = req.body;
                console.log(utilisateurId);
                const articleId = req.params.articleId; // Récupération de l'articleId depuis l'URL
                if (!utilisateurId || !articleId || !description) {
                    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
                }
                const connectedUser = yield prisma.users.findUnique({
                    where: { id: utilisateurId },
                });
                if (!connectedUser) {
                    return res.status(404).json({ error: "Utilisateur non trouvé." });
                }
                if (connectedUser.role !== "vendeur") {
                    return res.status(403).json({ error: "Seuls les vendeurs peuvent poster des articles." });
                }
                // Vérifiez si l'article existe déjà
                const article = yield prisma.articles.findUnique({
                    where: { id: Number(articleId) }, // Assurez-vous que articleId est bien un nombre
                });
                if (!article) {
                    return res.status(404).json({ error: "Article non trouvé." });
                }
                // Créer un nouveau post d'article
                const newPostArticle = yield prisma.posts.create({
                    data: {
                        utilisateurId,
                        articlesid: Number(articleId), // Assurez-vous que articlesid est bien un nombre
                        description,
                        datePublication: new Date(),
                    },
                });
                res.status(201).json(newPostArticle);
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        });
    }
}
