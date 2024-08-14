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
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail.js';
import { validateImageExtension, validateName } from '../utils/Validator.js';
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
                    .json({ error: 'Tous les champs sont obligatoires' });
            }
            if (password.length < 8) {
                return res
                    .status(401)
                    .json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
            }
            if (role !== 'tailleur' && role !== 'visiteur') {
                return res
                    .status(402)
                    .json({ error: "Le rôle doit être 'tailleur' ou 'visiteur'" });
            }
            if (password !== confirmationPassword) {
                return res
                    .status(405)
                    .json({ error: 'Les mots de passe ne correspondent pas' });
            }
            if (!isEmail(email)) {
                return res.status(406).json({ error: "Cet email n'est pas valide" });
            }
            if (!validateName(nom)) {
                return res.status(406).json({ error: 'Le nom n\'est pas valide' });
            }
            if (!validateName(prenom)) {
                return res.status(406).json({ error: 'Le prénom n\'est pas valide' });
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
                    .json({ error: 'Tous les champs sont obligatoires' });
            }
            try {
                const user = yield prisma.users.findUnique({
                    where: { email },
                });
                if (!user) {
                    return res.status(401).json({ error: 'Utilisateur inconnu' });
                }
                const userPassword = user === null || user === void 0 ? void 0 : user.password;
                const isValidPassword = yield bcrypt.compare(password, userPassword);
                if (!isValidPassword) {
                    return res.status(401).json({ error: 'Mot de passe incorrect' });
                }
                const token = jwt.sign({ userID: user.id }, process.env.TokenKey);
                res.cookie('token', token, {
                    httpOnly: true,
                    // secure: true, // Uncomment if using HTTPS
                    path: '/',
                });
                res.status(200).json({ token, user });
            }
            catch (error) {
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        });
    }
    static logout(req, res) {
        res.clearCookie('token', {
            // secure: true, // Uncomment if using HTTPS
            httpOnly: true,
            path: '/',
        });
        res.status(200).json('Déconnexion réussie');
    }
}
