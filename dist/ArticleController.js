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
import { validateImageExtension, validateName } from '../utils/Validator.js';
//import validator from 'validator';
const prisma = new PrismaClient();
export default class ArticleController {
    static createArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            const { libelle, prix, type, image, quantite } = req.body;
            if (!userId || !type || !prix || !libelle || !image) {
                return res.status(400).json({ error: "Tous les champs sont obligatoires" });
            }
            if (prix <= 0) {
                return res.status(400).json({ error: "Le prix doit être supérieur à 0" });
            }
            if (!validateImageExtension(image)) {
                return res.status(400).json({ error: "L'extension de l'image n'est pas valide" });
            }
            try {
                const user = yield prisma.users.findUnique({ where: { id: userId } });
                if (!user || user.role !== "vendeur") {
                    return res.status(403).json({ error: "Vous ne pouvez pas créer un article" });
                }
                if (type !== "tissu" && type !== "accessoire") {
                    return res.status(400).json({ error: "Le type de l'article doit être 'tissu' ou 'accessoire'" });
                }
                if (!validateName(libelle)) {
                    return res.status(400).json({ error: "Le libelle doit contenir entre 2 et 100 caractères" });
                }
                //on verifier si le libelle exsiste déjà
                const existingArticle = yield prisma.articles.findFirst({ where: { libelle } });
                if (existingArticle) {
                    return res.status(400).json({ error: "Le libelle de l'article existe déjà" });
                }
                //on verifie si la quantité est supérieure à 0
                if (!Number.isInteger(quantite) || quantite < 0) {
                    return res.status(400).json({ error: "La quantité doit être un entier supérieur à 0" });
                }
                if (quantite <= 0) {
                    return res.status(400).json({ error: "La quantité doit être supérieure à 0" });
                }
                const newArticle = yield prisma.articles.create({
                    data: {
                        image,
                        libelle,
                        prix,
                        quantite,
                        type
                    }
                });
                res.status(201).json(newArticle);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
