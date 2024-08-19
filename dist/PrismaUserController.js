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
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail.js";
import { validateImageExtension, validateName } from "../utils/Validator.js";
const prisma = new PrismaClient();
export default class PrismaUserController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nom, prenom, email, password, confirmationPassword, photoProfile, role, } = req.body;
            console.log(req.body);
            if (!nom ||
                !prenom ||
                !email ||
                !password ||
                !confirmationPassword ||
                !photoProfile ||
                !role) {
                return res
                    .status(400)
                    .json({ error: "Tous les champs sont obligatoires" });
            }
            if (password.length < 8) {
                return res
                    .status(401)
                    .json({ error: "Le mot de passe doit contenir au moins 8 caractères" });
            }
            if (role !== "tailleur" && role !== "visiteur") {
                return res
                    .status(402)
                    .json({ error: "Le rôle doit être 'tailleur' ou 'visiteur'" });
            }
            if (password !== confirmationPassword) {
                return res
                    .status(405)
                    .json({ error: "Les mots de passe ne correspondent pas" });
            }
            if (!isEmail(email)) {
                return res.status(406).json({ error: "Cet email n'est pas valide" });
            }
            if (!validateName(nom)) {
                return res.status(406).json({ error: "Le nom n'est pas valide" });
            }
            if (!validateName(prenom)) {
                return res.status(406).json({ error: "Le prénom n'est pas valide" });
            }
            if (!validateImageExtension(photoProfile)) {
                return res
                    .status(406)
                    .json({ error: "L'extension de l'image n'est pas valide" });
            }
            try {
                const hashedPassword = yield bcrypt.hash(password, 10);
                const existingUser = yield prisma.users.findUnique({
                    where: { email },
                });
                if (existingUser) {
                    return res.status(407).json({ error: "Cet email est déjà utilisé" });
                }
                const user = yield prisma.users.create({
                    data: {
                        nom,
                        prenom,
                        email,
                        password: hashedPassword,
                        photoProfile,
                        role,
                    },
                });
                res.status(201).json(user);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                return res
                    .status(400)
                    .json({ error: "Tous les champs sont obligatoires" });
            }
            try {
                const user = yield prisma.users.findUnique({
                    where: { email },
                });
                if (!user) {
                    return res.status(401).json({ error: "Utilisateur inconnu" });
                }
                const userPassword = user === null || user === void 0 ? void 0 : user.password;
                const isValidPassword = yield bcrypt.compare(password, userPassword);
                if (!isValidPassword) {
                    return res.status(401).json({ error: "Mot de passe incorrect" });
                }
                const token = jwt.sign({ userID: user.id }, process.env.TokenKey);
                res.cookie("token", token, {
                    httpOnly: true,
                    // secure: true, // Uncomment if using HTTPS
                    path: "/",
                });
                res.status(200).json({ token, user });
            }
            catch (error) {
                res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
    static logout(req, res) {
        res.clearCookie("token", {
            // secure: true, // Uncomment if using HTTPS
            httpOnly: true,
            path: "/",
        });
        res.status(200).json("Déconnexion réussie");
    }
    //addNote
    static addNotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = req.params;
            const { rate } = req.body;
            // Validate rate
            if (typeof rate !== "number" || rate < 1 || rate > 5) {
                return res
                    .status(400)
                    .json({ error: "La note doit être un nombre entre 1 et 5" });
            }
            try {
                const userToRate = yield prisma.users.findUnique({
                    where: { id: parseInt(id, 10) },
                    include: { UsersNotes_UsersNotes_raterIDToUsers: true },
                });
                if (!userToRate) {
                    return res.status(403).json({ error: "Utilisateur non trouvé" });
                }
                if (userToRate.role !== "tailleur") {
                    return res
                        .status(402)
                        .json({ error: "Vous ne pouvez pas noter un visiteur" });
                }
                const raterId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
                if (!raterId) {
                    return res
                        .status(403)
                        .json({ error: "Connectez-vous d'abord pour noter" });
                }
                if (userToRate.id === raterId) {
                    return res
                        .status(400)
                        .json({ error: "Vous ne pouvez pas vous noter vous-même" });
                }
                const existingNote = userToRate.UsersNotes_UsersNotes_raterIDToUsers.find((note) => note.raterID === raterId);
                if (existingNote) {
                    return res
                        .status(400)
                        .json({ error: "Vous avez déjà noté cet utilisateur" });
                }
                const note = yield prisma.usersNotes.create({
                    data: {
                        rate,
                        raterID: raterId,
                        userId: userToRate.id,
                    },
                });
                res.status(200).json({ message: "Note ajoutée avec succès", note });
            }
            catch (error) {
                res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
    //reportUser
    static reportUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = req.user.userID;
            const { reason } = req.body;
            if (!reason || typeof reason !== "string") {
                return res
                    .status(400)
                    .json({ error: "La raison du signalement est requise" });
            }
            console.log(reason);
            console.log(userId);
            try {
                const userToReport = yield prisma.users.findUnique({
                    where: { id: userId },
                    include: { UsersSignals_UsersSignals_reporterIdToUsers: true },
                });
                /* console.log(userToReport);  */
                if (!userToReport) {
                    return res.status(402).json({ error: "Utilisateur non trouvé" });
                }
                const reporterId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
                if (!reporterId) {
                    return res
                        .status(403)
                        .json({ error: "Connectez-vous d'abord pour signaler" });
                }
                if (!(userToReport.id === reporterId)) {
                    return res
                        .status(403)
                        .json({ error: "Vous ne pouvez pas vous signaler vous-même" });
                }
                const alreadyReported = userToReport.UsersSignals_UsersSignals_reporterIdToUsers.some((signal) => signal.reporterId === reporterId);
                if (alreadyReported) {
                    return res
                        .status(405)
                        .json({ error: "Vous avez déjà signalé cet utilisateur" });
                }
                const signal = yield prisma.usersSignals.create({
                    data: {
                        reason,
                        reporterId: reporterId,
                        userId: userToReport.id,
                    },
                });
                res
                    .status(200)
                    .json({ message: "Signalement ajouté avec succès", signal });
            }
            catch (error) {
                res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
    // Méthode unfollowUser
    static unfollowUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userID;
            const followerId = Number(req.body.followerId);
            console.log(followerId);
            console.log(userId);
            if (!userId) {
                return res
                    .status(400)
                    .json({ error: "L'id de l'utilisateur à désabonner est obligatoire" });
            }
            try {
                if (!followerId) {
                    return res.status(401).json({
                        message: "Vous devez vous connecter pour effectuer cette action",
                    });
                }
                const userToUnfollow = yield prisma.users.findFirst({
                    where: { id: followerId },
                });
                if (!userToUnfollow) {
                    return res.status(404).json({ message: "Utilisateur non trouvé" });
                }
                if (userToUnfollow.id === userId) {
                    return res
                        .status(400)
                        .json({ message: "Vous ne pouvez pas vous désabonner de vous-même" });
                }
                // Retirer l'utilisateur connecté de la liste des followers de l'utilisateur ciblé
                yield prisma.followers.delete({
                    where: { followerId: followerId },
                });
                // Retirer l'utilisateur ciblé de la liste des followings de l'utilisateur connecté
                return res
                    .status(200)
                    .json({ message: "Désabonnement effectué avec succès" });
            }
            catch (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erreur lors du désabonnement", error: err });
            }
        });
    }
    // Méthode followUser
    static followUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userID;
            const followerId = Number(req.body.followerId);
            console.log(typeof (userId));
            console.log(typeof (followerId));
            if (!followerId) {
                return res
                    .status(400)
                    .json({ message: "L'id de l'utilisateur à suivre est obligatoire" });
            }
            if (!userId) {
                return res
                    .status(400)
                    .json({ error: "L'id de l'utilisateur à suivre est obligatoire" });
            }
            try {
                const followerExists = yield prisma.users.findUnique({
                    where: { id: followerId },
                });
                const followingExists = yield prisma.users.findUnique({
                    where: { id: userId },
                });
                if (!followerExists || !followingExists) {
                    return res.status(404).json({ message: "Utilisateur non trouvé" });
                }
                if (Number(followerId) === userId) {
                    return res
                        .status(400)
                        .json({ message: "Vous ne pouvez pas vous abonner de vous-même" });
                }
                // Connectez l'utilisateur à l'utilisateur que vous essayez de suivre
                yield prisma.followers.create({
                    data: {
                        userId: userId,
                        followerId: followerId,
                    }
                });
                // Connectez l'utilisateur que vous essayez de suivre à l'utilisateur connecté
                return res
                    .status(200)
                    .json({ message: "Abonnement effectué avec succès" });
            }
            catch (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erreur lors de l'abonnement", error: err });
            }
        });
    }
    // Méthode profile
    static profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            const utilisateurId = Number(req.body.utilisateurId);
            if (!userId) {
                return res.status(401).json({
                    message: "Vous devez vous connecter pour accéder à ce contenu",
                });
            }
            console.log(utilisateurId);
            try {
                if (!userId) {
                    return res.status(401).json({
                        message: "Vous devez vous connecter pour accéder à ce contenu",
                    });
                }
                const user = yield prisma.users.findUnique({
                    where: { id: utilisateurId },
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        photoProfile: true,
                        role: true,
                        credits: true,
                        Followers_Followers_userIdToUsers: true,
                        Followers_Followers_followerIdToUsers: true,
                        BlockedUsers: true,
                        // Ajoutez d'autres champs que vous souhaitez renvoyer
                    },
                });
                if (!utilisateurId) {
                    return res.status(404).json({ message: "Utilisateur non trouvé" });
                }
                return res.status(200).json(user);
            }
            catch (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({
                    message: "Erreur lors de la récupération du profil",
                    error: err,
                });
            }
        });
    }
    // Méthode changeRole
    static changeRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
                if (!userId) {
                    return res.status(401).json({
                        message: "Vous devez vous connecter pour effectuer cette action",
                    });
                }
                const user = yield prisma.users.findUnique({
                    where: { id: userId },
                });
                if (!user) {
                    return res.status(404).json({ message: "Utilisateur non trouvé" });
                }
                if (((_b = user === null || user === void 0 ? void 0 : user.credits) !== null && _b !== void 0 ? _b : 0) <= 1) {
                    return res.status(402).json({
                        message: "Vous n'avez pas assez de crédits pour changer de rôle",
                    });
                }
                const newRole = user.role === "visiteur" ? "tailleur" : "visiteur";
                const updatedUser = yield prisma.users.update({
                    where: { id: userId },
                    data: {
                        role: newRole,
                        credits: { decrement: 1 },
                    },
                });
                return res
                    .status(200)
                    .json({ message: "Rôle mis à jour avec succès", user: updatedUser });
            }
            catch (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({ message: "Erreur lors du changement de rôle", error: error });
            }
        });
    }
    // Méthode bloquerUsers
    static bloquerUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            /* const { userID } = req.params; */
            const utilisateurId = Number(req.body.utilisateurId);
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            const storyId = req.body.storyId;
            console.log(utilisateurId);
            console.log(userId);
            if (!userId) {
                return res.status(401).json({
                    message: "Vous devez vous connecter pour effectuer cette action",
                });
            }
            if (!utilisateurId || isNaN(Number(utilisateurId))) {
                return res.status(400).json({ error: "ID utilisateur invalide" });
            }
            if (!storyId) {
                return res.status(400).json({ error: "ID de la story obligatoire" });
            }
            try {
                const story = yield prisma.stories.findUnique({
                    where: { id: Number(storyId) },
                });
                if (!story) {
                    return res.status(404).json({ error: "Story non trouvée" });
                }
                if (Number(utilisateurId) === userId) {
                    return res
                        .status(400)
                        .json({ error: "Vous ne pouvez pas vous bloquer vous-même" });
                }
                const userToBlock = yield prisma.users.findUnique({
                    where: { id: Number(utilisateurId) },
                });
                if (!userToBlock) {
                    return res
                        .status(404)
                        .json({ error: "Utilisateur à bloquer non trouvé" });
                }
                const currentUser = yield prisma.users.findUnique({
                    where: { id: userId },
                    include: { BlockedUsers: true },
                });
                if (!currentUser) {
                    return res
                        .status(404)
                        .json({ error: "Utilisateur courant non trouvé" });
                }
                const alreadyBlocked = currentUser.BlockedUsers.some((BlockedUsers) => BlockedUsers.id === Number(utilisateurId));
                if (alreadyBlocked) {
                    return res
                        .status(400)
                        .json({ error: "Vous avez déjà bloqué cet utilisateur" });
                }
                yield prisma.blockedUsers.create({
                    data: {
                        storyId: Number(storyId),
                        blockedUserId: Number(utilisateurId),
                    },
                });
                currentUser.BlockedUsers.push({
                    id: utilisateurId,
                    storyId: Number(storyId),
                    blockedUserId: Number(utilisateurId)
                });
                console.log(currentUser.BlockedUsers);
                return res
                    .status(200)
                    .json({ message: "Utilisateur bloqué avec succès" });
            }
            catch (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({ error: "Erreur interne du serveur", details: error });
            }
        });
    }
    // Méthode debloquerUsers
    static debloquerUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const utilisateurId = Number(req.body.utilisateurId);
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            const storyId = req.body.storyId;
            //console.log(userId);
            //console.log(utilisateurId);
            //console.log(storyId);
            if (!userId) {
                return res.status(401).json({
                    message: "Vous devez vous connecter pour effectuer cette action",
                });
            }
            if (!utilisateurId || isNaN(Number(utilisateurId))) {
                return res.status(400).json({ error: "ID utilisateur invalide" });
            }
            if (!storyId) {
                return res.status(400).json({ error: "ID de la story obligatoire" });
            }
            try {
                const story = yield prisma.stories.findUnique({
                    where: { id: Number(storyId) },
                });
                if (!story) {
                    return res.status(404).json({ error: "Story non trouvée" });
                }
                if (Number(utilisateurId) === userId) {
                    return res
                        .status(400)
                        .json({ error: "Vous ne pouvez pas vous débloquer vous-même" });
                }
                const userToUnblock = yield prisma.users.findUnique({
                    where: { id: Number(utilisateurId) },
                });
                if (!userToUnblock) {
                    return res
                        .status(404)
                        .json({ error: "Utilisateur à débloquer non trouvé" });
                }
                const currentUser = yield prisma.users.findUnique({
                    where: { id: userId },
                    include: { BlockedUsers: true },
                });
                if (!currentUser) {
                    return res
                        .status(404)
                        .json({ error: "Utilisateur courant non trouvé" });
                }
                console.log(currentUser.BlockedUsers);
                /* const isBlocked = currentUser.BlockedUsers.some(
                  (blockedUser) => blockedUser.id === Number(utilisateurId)
                ); */
                //on n'a pas accée a  currentUser.BlockedUsers donc on va directent verifier si l'utilisateur est bloqué dans la base de données dans la table BlockedUsers
                const isBlocked = yield prisma.blockedUsers.findMany({
                    where: {
                        AND: [
                            { storyId: Number(storyId) },
                            { blockedUserId: Number(utilisateurId) },
                        ],
                    },
                });
                if (!isBlocked) {
                    return res
                        .status(400)
                        .json({ error: "Cet utilisateur n'est pas bloqué" });
                }
                yield prisma.blockedUsers.deleteMany({
                    where: {
                        storyId: Number(storyId),
                        blockedUserId: Number(utilisateurId),
                    },
                });
                return res
                    .status(200)
                    .json({ message: "Utilisateur débloqué avec succès" });
            }
            catch (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({ error: "Erreur interne du serveur", details: error });
            }
        });
    }
    static updateNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id, noteId } = req.params;
            const { rate } = req.body;
            // Validate rate
            if (typeof rate !== "number" || rate < 1 || rate > 5) {
                return res
                    .status(400)
                    .json({ error: "La note doit être un nombre entre 1 et 5" });
            }
            try {
                const userToRate = yield prisma.users.findUnique({
                    where: { id: parseInt(id, 10) },
                    include: { UsersNotes_UsersNotes_raterIDToUsers: true },
                });
                if (!userToRate) {
                    return res.status(403).json({ error: "Utilisateur non trouvé" });
                }
                if (userToRate.role !== "tailleur") {
                    return res
                        .status(402)
                        .json({ error: "Vous ne pouvez pas noter un visiteur" });
                }
                const raterId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
                if (!raterId) {
                    return res
                        .status(403)
                        .json({ error: "Connectez-vous d'abord pour modifier une note" });
                }
                if (userToRate.id === raterId) {
                    return res
                        .status(400)
                        .json({ error: "Vous ne pouvez pas vous noter vous-même" });
                }
                const existingNote = yield prisma.usersNotes.findUnique({
                    where: {
                        id: parseInt(noteId, 10),
                        raterID: raterId,
                        userId: userToRate.id,
                    },
                });
                if (!existingNote) {
                    return res
                        .status(404)
                        .json({
                        error: "Note non trouvée ou vous n'avez pas la permission de la modifier",
                    });
                }
                const updatedNote = yield prisma.usersNotes.update({
                    where: { id: existingNote.id },
                    data: { rate },
                });
                res
                    .status(200)
                    .json({ message: "Note mise à jour avec succès", updatedNote });
            }
            catch (error) {
                res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
    static chargeCredit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Récupérer l'utilisateur connecté
                const connectedUser = yield prisma.users.findUnique({
                    where: { id: req.user.userID },
                });
                if (!connectedUser || connectedUser.role !== "tailleur") {
                    return res
                        .status(400)
                        .json({ message: "Vous n'êtes pas connecté en tant que tailleur" });
                }
                const { credits } = req.body;
                const comparedAmount = parseInt(credits, 10);
                if (!comparedAmount) {
                    return res.status(402).send("Vous devez saisir un montant valide");
                }
                else if (![1000, 2000, 3000].includes(comparedAmount)) {
                    return res.status(402).send("Vous devez saisir 1000, 2000 ou 3000");
                }
                let credit = 0;
                switch (comparedAmount) {
                    case 1000:
                        credit = 10;
                        break;
                    case 2000:
                        credit = 20;
                        break;
                    case 3000:
                        credit = 30;
                        break;
                }
                // Mettre à jour les crédits de l'utilisateur
                yield prisma.users.update({
                    where: { id: connectedUser.id },
                    data: {
                        credits: {
                            increment: credit,
                        },
                    },
                });
                return res.status(200).json({
                    message: `Rechargement de ${comparedAmount} Fr réussi.`,
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
}
