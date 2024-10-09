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
export default class ListeSouhaitsController {
    static listeSouhaits(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Vérifier si l'utilisateur est connecté
                const connectedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
                if (!connectedUserId) {
                    return res.status(400).json({ message: "Vous n'êtes pas connecté" });
                }
                // Vérifier si le post existe
                const postId = parseInt(req.params.id, 10);
                const post = yield prisma.posts.findUnique({
                    where: { id: postId },
                });
                if (!post) {
                    return res.status(404).json({ message: "Ce post n'existe pas !" });
                }
                // Vérifier si le post appartient à l'utilisateur connecté
                if (post.utilisateurId === connectedUserId) {
                    return res.status(400).json({ message: "Vous ne pouvez pas ajouter votre propre post à la liste des souhaits" });
                }
                // Vérifier si le modèle du post existe
                if (!post.modelId) {
                    return res.status(400).json({ message: "Ce post n'a pas de modèle associé" });
                }
                // Vérifier si le modèle est déjà dans la liste des souhaits
                const existingWish = yield prisma.listeSouhaits.findFirst({
                    where: {
                        userId: connectedUserId,
                        postId: postId,
                    },
                });
                if (existingWish) {
                    return res.status(400).json({ message: "Ce modèle est déjà dans votre liste des souhaits" });
                }
                // Ajouter le modèle à la liste des souhaits
                yield prisma.listeSouhaits.create({
                    data: {
                        userId: connectedUserId,
                        postId: postId,
                    },
                });
                return res.status(201).json({ message: "Modèle ajouté à la liste des souhaits avec succès" });
            }
            catch (err) {
                return res.status(500).json({ message: "Erreur lors de l'ajout du modèle à la liste des souhaits : " + err });
            }
        });
    }
    static voirListeSouhaits(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Vérifier si l'utilisateur est connecté
                const connectedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
                if (!connectedUserId) {
                    return res.status(400).json({ message: "Vous n'êtes pas connecté" });
                }
                // Récupérer la liste des souhaits de l'utilisateur connecté
                const listeSouhaits = yield prisma.listeSouhaits.findMany({
                    where: { userId: connectedUserId },
                    include: {
                        Posts: true, // Inclure les détails des posts
                    },
                });
                if (listeSouhaits.length === 0) {
                    return res.status(200).json({ message: "Votre liste de souhaits est vide." });
                }
                // Renvoyer la liste des souhaits
                return res.status(200).json(listeSouhaits);
            }
            catch (err) {
                return res.status(500).json({ message: "Erreur lors de la récupération de la liste des souhaits : " + err });
            }
        });
    }
    static supprimerSouhait(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Vérifier si l'utilisateur est connecté
                const connectedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
                if (!connectedUserId) {
                    return res.status(400).json({ message: "Vous n'êtes pas connecté" });
                }
                // Récupérer l'ID du souhait à supprimer
                const wishId = parseInt(req.params.id, 10);
                if (isNaN(wishId)) {
                    return res.status(400).json({ message: "ID de souhait invalide" });
                }
                // Vérifier si le souhait existe
                const existingWish = yield prisma.listeSouhaits.findUnique({
                    where: {
                        id: wishId,
                    },
                });
                if (!existingWish) {
                    return res.status(404).json({ message: "Ce souhait n'existe pas !" });
                }
                // Vérifier si le souhait appartient à l'utilisateur connecté
                if (existingWish.userId !== connectedUserId) {
                    return res.status(403).json({ message: "Vous ne pouvez pas supprimer ce souhait" });
                }
                // Supprimer le souhait
                yield prisma.listeSouhaits.delete({
                    where: { id: wishId },
                });
                return res.status(200).json({ message: "Souhait supprimé avec succès" });
            }
            catch (err) {
                return res.status(500).json({ message: "Erreur lors de la suppression du souhait : " + err });
            }
        });
    }
}
