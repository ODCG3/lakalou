import UserModel from "../models/UserModel.js";
import isEmail from "validator/lib/isEmail.js";
import validateName, { validateImageExtension } from "../utils/Validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import user from "../models/UserModel.js";
const ObjectId = mongoose.Types.ObjectId;

export default class UserController {
    static async create(req, res) {
        const {
            nom,
            prenom,
            email,
            password,
            confirmationPassword,
            photoProfile,
            role,
        } = req.body;

        console.log(req.body);

        if (
            !nom ||
            !prenom ||
            !email ||
            !password ||
            !confirmationPassword ||
            !photoProfile ||
            !role
        ) {
            return res
                .status(400)
                .json({ error: "Tous les champs sont obligatoires" });
        }

        if (password !== confirmationPassword) {
            return res
                .status(400)
                .json({ error: "Les mots de passe ne correspondent pas" });
        }

        if (!isEmail(email)) {
            return res.status(400).json({ error: "Cet email n'est pas valide" });
        }

        if (!validateName(nom)) {
            return res.status(400).json({ error: "Le nom n'est pas valide" });
        }

        if (!validateName(prenom)) {
            return res.status(400).json({ error: "Le prénom n'est pas valide" });
        }

        if (!validateImageExtension(photoProfile)) {
            return res
                .status(400)
                .json({ error: "L'extension de l'image n'est pas valide" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }

        try {
            const user = UserModel.create({
                nom,
                prenom,
                email,
                password: hashedPassword,
                photoProfile,
                role,
            });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Tous les champs sont obligatoires" });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Utilisateur inconnu" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
        }

        const token = jwt.sign({ userID: user._id }, process.env.TokenKey);

        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            path: "/",
        });

        res.json({ token, user });
    }


    static logout(req, res) {
        res.clearCookie("token", {
            // secure: true,
            httpOnly: true,
            path: "/",
        });

        res.json("logged out");
    }

    static async addNote(req, res) {
        const { id } = req.params;
        const { rate } = req.body;

        if (typeof rate !== 'number' || rate < 1 || rate > 5) {
            return res.status(400).json({ error: 'La note doit être un nombre entre 1 et 5' });
        }

        const userToRate = await UserModel.findById(id);

        if (userToRate.role != "tailleur") {
            return res.status(403).json({ error: 'Vous ne pouvez pas noter un visiteur' });
        }

        if (!userToRate) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        try {

            const raterId = req.user.userID;

            if (userToRate._id.toString() === raterId) {
                return res.status(400).json({ error: 'Vous ne pouvez pas vous noter vous-même' });
            }

            const existingNote = userToRate.notes.find(note => note.idTailleur.toString() === raterId.toString());
            if (existingNote) {
                return res.status(400).json({ error: 'Vous avez déjà noté cet utilisateur' });
            }

            const note = {
                rate,
                idTailleur: raterId
            };

            userToRate.notes.push(note);
            await userToRate.save();

            res.status(200).json({ message: 'Note ajoutée avec succès' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async reportUser(req, res) {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason || typeof reason !== 'string') {
            return res.status(400).json({ error: 'La raison du signalement est requise' });
        }

        const userToReport = await UserModel.findById(id);
        if (!userToReport) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        try {

            const reporterId = req.user.userID;

            if (userToReport._id.toString() === reporterId) {
                return res.status(400).json({ error: 'Vous ne pouvez pas vous signaler vous-même' });
            }

            const alreadyReported = userToReport.signals.some(signal => signal.idReporter.toString() === reporterId.toString());
            if (alreadyReported) {
                return res.status(400).json({ error: 'Vous avez déjà signalé cet utilisateur' });
            }

            const signal = {
                reason,
                idReporter: reporterId
            };

            userToReport.signals.push(signal);
            await userToReport.save();

            res.status(200).json({ message: 'Signalement ajouté avec succès' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static test(req, res) {
        const data = {
            name: "jdzk",
            idfiez: "jkfzfjz",
        };

        res.json(data);
    }



    //-------------------- MÉTHODE D'AJOUT FOLLOWING DE L'UTILISATEUR CONNECTÉ:
    static async followUser(req, res) {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Id Non trouvé" });
        }

        try {
            const userId = req.user.userID;
            if (!userId) {
                return res.status(401).json({ message: "Aucun Token en cours" });
            }
            const userToFollow = await UserModel.findById(req.params.id);
            if (userToFollow.role != "tailleur") {
                res
                    .status(402)
                    .json({ message: "Vous ne pouvez pas suivre un visiteur" });
            } else {
                await UserModel.findByIdAndUpdate(
                    req.params.id,
                    { $addToSet: { followers: userId } },
                    { new: true, upsert: true }
                );

                await UserModel.findByIdAndUpdate(
                    req.body.follower,
                    { $addToSet: { followings: req.params.id } },
                    { new: true, upsert: true }
                );
                res.status(201).json({ message: "Follower ajouté avec succès !" });
            }
        } catch (err) {
            res.status(400).json({ message: "Erreur ajout follower: " + err });
        }
    }

    //--------------------MÉTHODE UNFOLLOWING DE L'UTILISATEUR CONNECTÉ:
    static async unfollowUser(req, res) {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Id Non trouvé" });
        }

        try {
            const userId = req.user.userID;

            if (!userId) {
                return res.status(401).json({
                    message: "Vous devez vous connecter pour suivre un Vendeur",
                });
            }
            await UserModel.findByIdAndUpdate(
                req.params.id,
                { $pull: { followers: userId } },
                { new: true, upsert: true }
            );

            await UserModel.findByIdAndUpdate(
                req.body.follower,
                { $pull: { followings: req.params.id } },
                { new: true, upsert: true }
            );
            res.status(201).json({ message: "Unfollowing ajouté avec succès !" });
        } catch (err) {
            res.status(400).json({ message: "Erreur Unfollowing " + err });
        }
    }

    static async profile(req, res) {
        const user = await UserModel.findOne({ _id: req.user.userID });
        res.json(user)
    }

    static async changeRole(req, res) {
        try {
            const user = await UserModel.findOne({ _id: req.user.userID });

            const role = user.role == "visiteur" ? "tailleur" : "visiteur";

            await UserModel.findByIdAndUpdate(req.user.userID, { role: role }, { new: true });
            res.json({response:"role updated successfully"});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
