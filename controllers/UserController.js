import UserModel from "../models/UserModel.js";
import PostModel from "../models/PostModel.js";
import Model from "../models/ModelModel.js";
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

  static async addNote(req, res) {
    const { id } = req.params;
    const { rate } = req.body;

    if (typeof rate !== "number" || rate < 1 || rate > 5) {
      return res
        .status(400)
        .json({ error: "La note doit être un nombre entre 1 et 5" });
    }

    const userToRate = await UserModel.findById(id);
    // const raterId = req.user.userID;

    if (userToRate.role != "tailleur") {
      return res
        .status(403)
        .json({ error: "Vous ne pouvez pas noter un visiteur" });
    }

    if (!userToRate) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // if(!raterId){
    //   return res.status(403).json({message: "Connectez-vous d'abord pour noter"})
    // }

    try {
      const raterId = req.user.userID;

      if (userToRate._id.toString() === raterId) {
        return res
          .status(400)
          .json({ error: "Vous ne pouvez pas vous noter vous-même" });
      }

      const existingNote = userToRate.notes.find(
        (note) => note.idTailleur.toString() === raterId.toString()
      );
      if (existingNote) {
        return res
          .status(400)
          .json({ error: "Vous avez déjà noté cet utilisateur" });
      }

      const note = {
        rate,
        raterId: raterId,
      };

      userToRate.notes.push(note);
      await userToRate.save();

      res.status(200).json({ message: "Note ajoutée avec succès" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async reportUser(req, res) {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || typeof reason !== "string") {
      return res
        .status(400)
        .json({ error: "La raison du signalement est requise" });
    }

    const userToReport = await UserModel.findById(id);
    if (!userToReport) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    try {
      const reporterId = req.user.userID;

      if (userToReport._id.toString() === reporterId) {
        return res
          .status(400)
          .json({ error: "Vous ne pouvez pas vous signaler vous-même" });
      }

      const alreadyReported = userToReport.signals.some(
        (signal) => signal.idReporter.toString() === reporterId.toString()
      );
      if (alreadyReported) {
        return res
          .status(400)
          .json({ error: "Vous avez déjà signalé cet utilisateur" });
      }

      const signal = {
        reason,
        idReporter: reporterId,
      };

      userToReport.signals.push(signal);
      await userToReport.save();

      res.status(200).json({ message: "Signalement ajouté avec succès" });
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
    res.json(user);
  }

  static async changeRole(req, res) {
    try {
      const user = await UserModel.findOne({ _id: req.user.userID });

      const role = user.role == "visiteur" ? "tailleur" : "visiteur";

      await UserModel.findByIdAndUpdate(
        req.user.userID,
        { role: role },
        { new: true }
      );
      res.json({ response: "role updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async bloquerUsers(req, res) {
    try {
      const userToBlock = await UserModel.findById(req.params.userID);
      if (!userToBlock) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      console.log(userToBlock._id.toString(), req.user.userID.toString());

      if (userToBlock._id.toString() === req.user.userID.toString()) {
        return res
          .status(400)
          .json({ error: "Vous ne pouvez pas vous bloquer vous-même" });
      }

      const alreadyBlocked = userToBlock.utilisateurBloque.some(
        (blockedUser) => blockedUser.toString() === req.user.userID.toString()
      );

      if (alreadyBlocked) {
        return res
          .status(400)
          .json({ error: "Vous avez déjà bloqué cet utilisateur" });
      }

      const currentUser = await UserModel.findById(req.user.userID);
      currentUser.utilisateurBloque.push(userToBlock._id);
      await currentUser.save();
      res.status(200).json({ message: "Utilisateur bloqué avec succès" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async debloquerUsers(req, res) {
    try {
      const userToUnblock = await UserModel.findById(req.params.userID);
      if (!userToUnblock) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const currentUser = await UserModel.findById(req.user.userID);
      if (!currentUser.utilisateurBloque.includes(userToUnblock._id)) {
        return res
          .status(400)
          .json({ error: "cet utilisateur n'a pas ete bloquer" });
      }

      currentUser.utilisateurBloque = currentUser.utilisateurBloque.filter(
        (blockedUser) => blockedUser.toString() !== userToUnblock._id.toString()
      );
      await currentUser.save();
      res.status(200).json({ message: "Utilisateur débloqué avec succès" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserBloquer(req, res) {
    try {
      const user = await UserModel.findById(req.user.userID);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      res.json(user.utilisateurBloque);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createDiscussion(req, res) {
    try {
      const userId = req.params.userId;

      const user = await UserModel.findById(req.user.userID);
      if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouvé" });
      }

      if (userId.toString() === req.user.userID.toString()) {
        return res.status(400).json({
          message:
            "Vous ne pouvez pas vous créer une discussion avec vous-même",
        });
      }

      // check if a discussion with the given user already exists
      const discussionExists = user.discussions.some(
        (discussion) => discussion.user.toString() === userId.toString()
      );
      if (discussionExists) {
        return res
          .status(400)
          .json({ message: "Une discussion avec cet utilisateur existe déjà" });
      }

      user.discussions.push({ user: userId, messages: [] });
      await user.save();

      res.status(201).json({ message: "Discussion créée avec succès" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDiscussions(req, res) {
    try {
      const user = await UserModel.findById(req.user.userID);
      if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouvé" });
      }

      const discussions = user.discussions;
      res.json(discussions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDiscussionsByUser(req, res) {
    try {
      const userId = req.params.userId;

      const user = await UserModel.findById(req.user.userID);
      if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouvé" });
      }

      const discussions = user.discussions.filter(
        (discussion) => discussion.user.toString() === userId
      );
      res.json(discussions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async sendMessageToDiscussion(req, res) {
    try {
      const discussionUser = req.params.discussionUser;

      const user = await UserModel.findById(req.user.userID);
      if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouvé" });
      }

      const discussion = user.discussions.find(
        (discussion) => discussion.user.toString() === discussionUser
      );
      if (!discussion) {
        return res.status(400).json({ message: "Discussion non trouvée" });
      }

      user.discussions
        .find((discussionId) => discussionId.user.toString() === discussionUser)
        .messages.push({ content: req.body.message });
      await user.save();

      res.status(201).json({ message: "Message envoyé avec succès" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // static async profile(req, res) {
  //     const user = await UserModel.findOne({ _id: req.user.userID });
  //     res.json(user);
  // }

  static async getTailleurRanking(req, res) {
    try {
      const ranking = await UserModel.aggregate([
        { $unwind: "$notes" },
        {
          $group: {
            _id: "$_id",
            nom: { $first: "$nom" },
            prenom: { $first: "$prenom" },
            email: { $first: "$email" },
            photoProfile: { $first: "$photoProfile" },
            role: { $first: "$role" },
            note: { $avg: "$notes.rate" },
          },
        },
        { $sort: { note: -1 } },
      ]);

      let currentRank = 1;
      let previousNote = null;
      ranking.forEach((item, index) => {
        if (previousNote === null || item.note < previousNote) {
          item.rang = currentRank;
        } else {
          item.rang = currentRank - 1;
        }
        previousNote = item.note;
        currentRank++;
      });

      res.status(200).json(ranking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async myFollowers(req, res) {
    const connectedUser = await UserModel.findById(req.user.userID);
    if (!connectedUser || connectedUser.role != "tailleur") {
      res
        .status(400)
        .json({ message: "Vous n'êtes pas connecté en tant que tailleur" });
    } else {
      const followers = await UserModel.find({
        _id: { $in: connectedUser.followers },
      });
      const followersNames = followers.map(
        (follower) => `${follower.prenom} ${follower.nom}`
      );
      res.status(200).json({ followersNames });
    }
  }

  static async myPosition(req, res) {
    const connectedUser = await UserModel.findById(req.user.userID);
    if (!connectedUser || connectedUser.role !== "tailleur") {
      res
        .status(400)
        .json({ message: "Vous n'êtes pas connecté en tant que tailleur" });
    } else {
      try {
        const allUsers = await UserModel.aggregate([
          { $unwind: "$notes" },
          {
            $group: {
              _id: "$_id",
              nom: { $first: "$nom" },
              prenom: { $first: "$prenom" },
              email: { $first: "$email" },
              photoProfile: { $first: "$photoProfile" },
              role: { $first: "$role" },
              averageRate: { $avg: "$notes.rate" },
            },
          },
          { $sort: { averageRate: -1 } },
        ]);

        let rank = 1;
        let previousRate = null;
        let tiedUsersCount = 0;

        for (let i = 0; i < allUsers.length; i++) {
          if (previousRate === allUsers[i].averageRate) {
            tiedUsersCount++;
          } else {
            rank += tiedUsersCount;
            tiedUsersCount = 1;
          }

          allUsers[i].rank = rank;
          previousRate = allUsers[i].averageRate;

          if (allUsers[i]._id.toString() === connectedUser.id.toString()) {
            const result = "Votre classement est " + allUsers[i].rank;
            res.status(200).send(result);
            return;
          }
        }

        res
          .status(404)
          .json({ message: "Utilisateur non trouvé dans le classement" });
      } catch (err) {
        res.status(500).json({ message: "Erreur " + err });
      }
    }
  }

  static async chargeCredit(req, res) {
    const connectedUser = await UserModel.findById(req.user.userID);
    if (!connectedUser || connectedUser.role !== "tailleur") {
      res
        .status(400)
        .json({ message: "Vous n'êtes pas connecté en tant que tailleur" });
    }
    const { credits } = req.body;
    const comparedAmount = parseInt(credits);
    if (!comparedAmount) {
      res.status(400).send("Vous devez saisir un montant valide");
    } else if (
      comparedAmount !== 1000 &&
      comparedAmount !== 2000 &&
      comparedAmount !== 3000
    ) {
      res.status(400).send("Vous devez saisir 1000, 2000 ou 3000");
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

      default:
        null;
    }
    await UserModel.findByIdAndUpdate(
      connectedUser.id,
      { $inc: { credits: credit } },
      { new: true }
    );
    res.status(200).json({
      message: `Rechargement ${comparedAmount} Fr réussi.`,
    });
  }

  static async updateNote(req, res) {
    const connectedUser = await UserModel.findById(req.user.userID);
    if (!connectedUser || connectedUser.role !== "tailleur") {
      res
        .status(400)
        .json({ message: "Vous n'êtes pas connecté en tant que tailleur" });
    }

    const notedUser = await UserModel.findById(req.params.id);
    if (!notedUser) {
      return res.status(402).json({ message: "ID tailleur non trouvé" });
    }

    const { newRate } = req.body;

    if (typeof newRate !== "number" || newRate < 1 || newRate > 5) {
      return res
        .status(400)
        .json({ error: "La note doit être un nombre entre 1 et 5" });
    }

    const noteIndex = notedUser.notes.findIndex(
      (note) => note.raterId.toString() === connectedUser.id.toString()
    );

    if (noteIndex === -1) {
      return res
        .status(400)
        .json({ message: "Vous n'avez pas encore noté pour ce tailleur" });
    } else {
      notedUser.notes[noteIndex].rate = newRate;

      await notedUser.save();

      return res.status(200).json({
        message: "Note mise à jour avec succès",
        rate: notedUser.notes[noteIndex].rate,
      });
    }
  }

  static async listeSouhaits(req, res) {
    const connectedUser = await UserModel.findById(req.user.userID);
    if (!connectedUser || connectedUser.role !== "visiteur") {
      res
        .status(400)
        .json({ message: "Vous n'êtes pas connecté en tant que visiteur" });
    }

    const post = await PostModel.findById(req.params.id);
    if (!post) {
      res.status(400).json({ message: "Ce Post n'est pas accessible !" });
    }

    try {
      const wishedModel = await Model.findById(post.model);
      const user = await UserModel.findById(connectedUser.id);

      const foundedModel = user.listeSouhaits.includes(wishedModel._id);
      if (foundedModel) {
        return res
          .status(400)
          .json({
            message: "Ce modèle est dèjas dans votre liste des souhaits",
          });
      } else {
        user.listeSouhaits.push(wishedModel._id);
        await user.save();
        res
          .status(201)
          .json({
            message: `modèle ajouté à la liste des souhait avec succès`,
          });
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "Erreur récupération model du post: " + err });
    }
  }
}
