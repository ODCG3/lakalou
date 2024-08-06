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
            // secure: true,
            path: '/',
        });

        res.json({ token, user});
    }

    static logout(req,res) {
        res.clearCookie('token',{
            // secure: true,
            httpOnly: true, 
            path: '/',
        });

        res.json("logged out");
    }

    static test(req, res) {
        const data = {
            name:"jdzk",
            idfiez:"jkfzfjz",
        }

        res.json(data);
    }

    static async profile(req, res){
        const user = await UserModel.findOne({_id:req.user.userID});
        res.json(user);
    }
}
