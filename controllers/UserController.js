import UserModel from "../models/UserModel.js";
import isEmail from 'validator/lib/isEmail.js';
import validateName, { validateImageExtension } from "../utils/Validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class UserController {

    static async create(req, res) {
        const { nom, prenom, email, password, confirmationPassword, photoProfile, role } = req.body;

        console.log(req.body);

        if (!nom || !prenom || !email || !password || !confirmationPassword || !photoProfile || !role) {
            return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
        }

        if (password !== confirmationPassword) {
            return res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
        }

        if (!isEmail(email)) {
            return res.status(400).json({ error: 'Cet email n\'est pas valide' });
        }

        if (!validateName(nom)) {
            return res.status(400).json({ error: 'Le nom n\'est pas valide' });
        }

        if (!validateName(prenom)) {
            return res.status(400).json({ error: 'Le prénom n\'est pas valide' });
        }

        if (!validateImageExtension(photoProfile)) {
            return res.status(400).json({ error: 'L\'extension de l\'image n\'est pas valide' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);



        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        try {

            const user = UserModel.create({
                nom,
                prenom,
                email,
                password: hashedPassword,
                photoProfile,
                role
            });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur inconnu' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({"userID":user._id},process.env.TokenKey);

        res.cookie('token', token,{
            httpOnly: true,
             path: '/',
        });

        res.json({ token, user});
    }

    static logout(req,res) {
        res.clearCookie('token',{
             httpOnly: true, 
            path: '/',
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
        if (!userToRate) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ error: 'Token manquant' });
            }

            const decoded = jwt.verify(token, process.env.TokenKey);
            const raterId = decoded.userID;

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
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ error: 'Token manquant' });
            }

            const decoded = jwt.verify(token, process.env.TokenKey);
            const reporterId = decoded.userID;

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
            name:"jdzk",
            idfiez:"jkfzfjz",
        }

        res.json(data);
    }
}
