import UserModel from "../models/UserModel.js";
import isEmail from "validator/lib/isEmail.js";
import validateName, { validateImageExtension } from "../utils/Validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
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

  static test(req, res) {
    const data = {
      name: "jdzk",
      idfiez: "jkfzfjz",
    };

    res.json(data);
  }


//------------------- RÉCUPÉRATION DE L'ID DE L'UTILISATEUR CONNECTÉ: 
  static getConnectedUserId(req){
    const token = req.cookies.token;
    if(!token){
      res.status(400).json({message: "Aucun token en cours"})
    } 
    try{
      const decodedToken = jwt.verify(token, process.env.TokenKey);
      return decodedToken.userID;
    }catch(err){
      res.status(400).json({message: 'Erreur récupération Token: ' + err})
    }
  }


//-------------------- AJOUTER FOLLOWING DE L'UTILISATEUR CONNECTÉ: 
  static async followUser(req, res) {
    if (
      !ObjectId.isValid(req.params.id) ||
      !ObjectId.isValid(req.body.follower)
    ) {
      return res.status(400).json({ message: "Id Non trouvé" });
    }
    
    // try{
    //   const userId = this.getConnectedUserId(req);
    //   console.log(userId);
    //   res.json({message: "Utilisateur iD: " + userId})
    // }
    // catch (error) {
    //   res.status(401).json({ error: error.message }); 
    // }
    
    try {
      const userId = this.getConnectedUserId(req);
      if(!userId){
        return res.status(401).json({message: "Aucun Token en cours"})
      }
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
    } catch (err) {
      res.status(400).json({ message: "Erreur ajout follower: " + err });
    }
  }
}
