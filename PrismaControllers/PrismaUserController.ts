import { PrismaClient } from "@prisma/client";
// import NotificationController from './NotificationController'; 
import NotificationController from './NotificationController.js';  // Notez l'extension .js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail.js";
import { validateImageExtension, validateName } from "../utils/Validator.js";
import { Request, Response } from "express";
import { Error } from "mongoose";
import validator from "validator";
const prisma = new PrismaClient();

interface Measurements {
  cou?: number;
  longueurPantallon?: number;
  epaule?: number;
  longueurManche?: number;
  hanche?: number;
  poitrine?: number;
  cuisse?: number;
  longueur?: number;
  tourBras?: number;
  tourPoignet?: number;
  ceinture?: number;
}

interface Tailleur {
  id: number;
  nom: string | null; // Permettre null si nécessaire
  prenom: string | null; // Permettre null si nécessaire
  email: string | null; // Permettre null si nécessaire
  photoProfile: string | null; // Permettre null si nécessaire
  role: string | null; // Modifiez ce type si nécessaire
  averageRate: number;
  rank: number; // Assurez-vous que rank est ici
}

export default class PrismaUserController {
  static async create(req: Request, res: Response) {
    const {
      nom,
      prenom,
      email,
      password,
      confirmationPassword,
      photoProfile,
      role,
    } = req.body;

    // Valider les données reçues
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

    if (password.length < 8) {
      return res
        .status(401)
        .json({ error: "Le mot de passe doit contenir au moins 8 caractères" });
    }

    if (password !== confirmationPassword) {
      return res
        .status(405)
        .json({ error: "Les mots de passe ne correspondent pas" });
    }

    if (!isEmail(email)) {
      return res.status(406).json({ error: "Cet email n'est pas valide" });
    }
    console.log(
      nom,
      prenom,
      email,
      password,
      confirmationPassword,
      photoProfile,
      role
    );
    try {
      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.users.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(407).json({ error: "Cet email est déjà utilisé" });
      }

      // Créer l'utilisateur avec l'URL de l'image déjà téléchargée sur Cloudinary
      const user = await prisma.users.create({
        data: {
          nom,
          prenom,
          email,
          password: hashedPassword,
          photoProfile, // URL de l'image envoyée depuis le frontend
          role,
          credits: 10,
        },
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Tous les champs sont obligatoires" });
    }

    try {
      let user = await prisma.users.findUnique({
        where: { email },
      });

      const message = await prisma.usersDiscussions.findMany({
        where: { userId: user?.id },
        include: {
          Users_UsersDiscussions_receiverIdToUsers: true,
          UsersDiscussionsMessages: true,
        },
      });

      const models = await prisma.models.findMany({
        where: {
          tailleurID: user?.id,
        },
      });

      const posts = await prisma.posts.findMany({
        include: {
          Models: true,
        },
      });

      // const stories = await prisma.stories.findMany({
      //   where: {
      //     Users: {
      //       Followers_Followers_followerIdToUsers: {
      //         some: {
      //           followerId: user?.id
      //         }
      //       },
      //     },
      //   },
      //   include: {
      //     Models: true,
      //   },
      // });

      const stories = await prisma.stories.findMany({
        where: {
          userId: {
            in: await prisma.followers
              .findMany({
                where: {
                  followerId: user?.id, // ID of the currently logged-in user
                },
                select: {
                  userId: true, // Get the user IDs of users being followed
                },
              })
              .then((follows) => follows.map((follow) => follow.userId)), // Extract the user IDs
          },
        },
        include: {
          Models: true, // Include any related models if needed
        },
      });

      if (!user) {
        return res.status(401).json({ error: "Utilisateur inconnu" });
      }

      const userPassword = user?.password;

      const isValidPassword = await bcrypt.compare(password, userPassword!);

      if (!isValidPassword) {
        return res.status(401).json({ error: "Mot de passe incorrect" });
      }

      const token = jwt.sign(
        { userID: user.id },
        process.env.TokenKey as string
      );

      res.cookie("token", token, {
        httpOnly: true,
        // secure: true, // Uncomment if using HTTPS
        path: "/",
      });

      res.status(200).json({ token, user, message, stories, posts, models });
    } catch (error) {
      res.status(500).json({ erreur: error });
    }
  }

  static logout(req: Request, res: Response) {
    res.clearCookie("token", {
      // secure: true, // Uncomment if using HTTPS
      httpOnly: true,
      path: "/",
    });

    res.status(200).json("Déconnexion réussie");
  }
  //addNote
  static async addNotes(req: Request, res: Response) {
    const { id } = req.params;
    const { rate } = req.body;

    // Validate rate
    if (typeof rate !== "number" || rate < 1 || rate > 5) {
      return res
        .status(400)
        .json({ error: "La note doit être un nombre entre 1 et 5" });
    }

    try {
      const userToRate = await prisma.users.findUnique({
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

      const raterId = req.user?.userID;

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

      // Check if the user has already rated the same user
      const existingNote = await prisma.usersNotes.findFirst({
        where: {
          raterID: raterId,
          userId: userToRate.id,
        },
      });

      if (existingNote) {
        return res
          .status(400)
          .json({ error: "Vous avez déjà noté cet utilisateur" });
      }

      const note = await prisma.usersNotes.create({
        data: {
          rate,
          raterID: raterId,
          userId: userToRate.id,
        },
      });

      res.status(200).json({ message: "Note ajoutée avec succès", note });
    } catch (error) {
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }
  // filterByNotes
  static async filterByNotes(req: Request, res: Response) {
    const { id } = req.params;
    //const userId = req.user!.userID;
    const { rate } = req.body;

    console.log(id, rate);
    try {
      const userToRate = await prisma.users.findUnique({
        where: { id: parseInt(id, 10) },
        include: { UsersNotes_UsersNotes_raterIDToUsers: true },
      });
      if (!userToRate) {
        return res.status(403).json({ error: "Utilisateur non trouvé" });
      }
      if (userToRate.role !== "tailleur") {
        return res.status(402).json({
          error: "Vous ne pouvez pas filtrer par notes pour un tailleur",
        });
      }
      const filteredNotes =
        userToRate.UsersNotes_UsersNotes_raterIDToUsers.filter(
          (note) => (note.rate ?? 0) >= rate
        );
      res.status(200).json(filteredNotes);
    } catch (error) {
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }
  //getNotes pour lister touts les notes du user connecter
  static async getNotes(req: Request, res: Response) {
    const userId = req.user!.userID;
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
        include: { UsersNotes_UsersNotes_raterIDToUsers: true },
      });

      if (!user) {
        return res.status(403).json({ error: "Utilisateur non trouvé" });
      }

      const notes = user.UsersNotes_UsersNotes_raterIDToUsers;
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  //getTotalNotes pour retourner la somme des notes de l'utilisateur par ID
  // static async getTotalNotesForPostUser(req: Request, res: Response) {
  //   const postId = parseInt(req.params.postId, 10);
  //   try {
  //     // Récupérer le post et l'utilisateurId associé
  //     const post = await prisma.posts.findUnique({
  //       where: { id: postId },
  //       select: { utilisateurId: true },
  //     });

  //     if (!post) {
  //       return res.status(404).json({ error: "Post non trouvé" });
  //     }

  //     // Récupérer toutes les notes de l'utilisateur
  //     const userNotes = await prisma.usersNotes.findMany({
  //       where: { userId: post.utilisateurId },
  //       select: { rate: true },
  //     });

  //     // Calculer le total des notes
  //     const totalNotes = userNotes.reduce(
  //       (sum, note) => sum + (note.rate || 0),
  //       0
  //     );

  //     res.status(200).json({
  //       utilisateurId: post.utilisateurId,
  //       totalNotes: totalNotes,
  //     });
  //   } catch (error) {
  //     console.error("Erreur lors de la récupération des notes:", error);
  //     res.status(500).json({ error: "Erreur interne du serveur" });
  //   }
  // }

  //reportUser

  static async getUserNotesFromPost(req: Request, res: Response) {
    const { postId } = req.params; // On récupère le postId des paramètres

    try {
      // Étape 1: Récupérer le post par son ID
      const post = await prisma.posts.findUnique({
        where: { id: Number(postId) },
        select: { utilisateurId: true }, // On ne récupère que l'utilisateur lié au post
      });

      if (!post) {
        return res.status(404).json({ error: "Post non trouvé" });
      }

      const userId = post.utilisateurId;

      // Étape 2: Récupérer les notes de cet utilisateur
      const userNotes = await prisma.usersNotes.findMany({
        where: { userId: userId }, // On utilise l'utilisateurId récupéré du post
        select: { rate: true }, // On récupère seulement les notes (rate)
      });

      if (userNotes.length === 0) {
        return res
          .status(404)
          .json({ message: "Aucune note trouvée pour cet utilisateur." });
      }

      // Calcul du total des notes
      const totalNotes = userNotes.reduce(
        (acc, note) => acc + (note.rate || 0),
        0
      );

      // On retourne le total des notes
      res.status(200).json({ totalNotes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  //getTotalNotes pour retourner la somme des notes de l'utilisateur par ID
  // static async getTotalNotesForPostUser(req: Request, res: Response) {
  //   const postId = parseInt(req.params.postId, 10);
  //   try {
  //     // Récupérer le post et l'utilisateurId associé
  //     const post = await prisma.posts.findUnique({
  //       where: { id: postId },
  //       select: { utilisateurId: true },
  //     });

  //     if (!post) {
  //       return res.status(404).json({ error: "Post non trouvé" });
  //     }

  //     // Récupérer toutes les notes de l'utilisateur
  //     const userNotes = await prisma.usersNotes.findMany({
  //       where: { userId: post.utilisateurId },
  //       select: { rate: true },
  //     });

  //     // Calculer le total des notes
  //     const totalNotes = userNotes.reduce(
  //       (sum, note) => sum + (note.rate || 0),
  //       0
  //     );

  //     res.status(200).json({
  //       utilisateurId: post.utilisateurId,
  //       totalNotes: totalNotes,
  //     });
  //   } catch (error) {
  //     console.error("Erreur lors de la récupération des notes:", error);
  //     res.status(500).json({ error: "Erreur interne du serveur" });
  //   }
  // }

  //reportUser
  static async reportUser(req: Request, res: Response) {
    // Récupérer l'ID de l'utilisateur à signaler depuis les paramètres
    const userIdToReport = Number(req.params.userId); // Assurez-vous que c'est un nombre

    const reporterId = req.user!.userID; // ID du reporter
    const { userId, reason } = req.body; // Récupérer l'ID de l'utilisateur à signaler et la raison

    // Validation de la raison
    if (!reason || typeof reason !== "string") {
        return res
            .status(400)
            .json({ error: "La raison du signalement est requise" });
    }

    console.log("Raison du signalement:", reason);
    console.log("ID de l'utilisateur à signaler:", userIdToReport);

    try {
        // Vérifiez si l'utilisateur à signaler existe
        const userToReport = await prisma.users.findUnique({
            where: { id: userIdToReport }, // Utilisez l'ID passé en paramètre
            include: { UsersSignals_UsersSignals_reporterIdToUsers: true },
        });

        if (!userToReport) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        const reporterId = req.user?.userID; // L'ID de l'utilisateur connecté

        if (!reporterId) {
            return res
                .status(403)
                .json({ error: "Connectez-vous d'abord pour signaler" });
        }

        // Vérifiez si l'utilisateur qui signale n'est pas le même que celui qui est signalé
        if (userIdToReport === reporterId) {
            return res
                .status(403)
                .json({ error: "Vous ne pouvez pas vous signaler vous-même" });
        }


        // Vérifiez si l'utilisateur a déjà été signalé
        const alreadyReported = userToReport.UsersSignals_UsersSignals_reporterIdToUsers.some(
            (signal: { reporterId: number }) => signal.reporterId === reporterId
        );

        if (alreadyReported) {
            return res
                .status(409) // Utilisez 409 pour conflit
                .json({ error: "Vous avez déjà signalé cet utilisateur" });
        }

        // Créez le signalement avec les bons ID
        const signal = await prisma.usersSignals.create({
            data: {
                reason,
                reporterId: reporterId,   // ID de l'utilisateur qui fait le signalement
                userId: userToReport.id,   // ID de l'utilisateur à signaler
            },
        });

        console.log("Signalement créé:", signal);
        res
            .status(200)
            .json({ message: "Signalement ajouté avec succès", signal });

    } catch (error) {
        console.error("Erreur lors du signalement:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  // Méthode unfollowUser
  static async unfollowUser(req: Request, res: Response) {
    const userId = req.user!.userID;
    const followerId = Number(req.body.followerId);
    console.log("FollowerId:", followerId);
    console.log("UserId:", userId);
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

    const userToUnfollow = await prisma.users.findFirst({
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
    await prisma.followers.deleteMany({
        where: {
          userId: userId,
          followerId: followerId,
        },
      });

    // Utiliser NotificationController pour créer la notification
    const notificationMessage = `L'utilisateur avec l'ID ${userId} s'est désabonné de vous.`;
    await NotificationController.createNotification(followerId, 'unfollowed', notificationMessage);

    return res
      .status(200)
      .json({ message: "Désabonnement effectué avec succès" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Erreur lors du désabonnement", error: err });
  }
}



  // Méthode followUser
  static async followUser(req: Request, res: Response) {
    const userId = req.user!.userID; // ID de l'utilisateur connecté
    const followerId = Number(req.body.followerId); // ID de l'utilisateur à suivre
  
    if (!followerId) {
      return res
        .status(400)
        .json({ message: "L'id de l'utilisateur à suivre est obligatoire" });
    }
    if (!userId) {
      return res
        .status(400)
        .json({ error: "L'id de l'utilisateur connecté est obligatoire" });
    }
  
    try {
      const followerExists = await prisma.users.findUnique({
        where: { id: followerId },
      });
      const followingExists = await prisma.users.findUnique({
        where: { id: userId },
      });
  
      if (!followerExists || !followingExists) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      if (Number(followerId) === userId) {
        return res
          .status(400)
          .json({ message: "Vous ne pouvez pas vous abonner à vous-même" });
      }
  
      // Vérifier si l'utilisateur suit déjà cette personne
      const alreadyFollowing = await prisma.followers.findFirst({
        where: {
          userId: userId,
          followerId: followerId,
        },
      });
  
      if (alreadyFollowing) {
        return res
          .status(400)
          .json({ message: "Vous suivez déjà cet utilisateur" });
      }
  
      // Connecter l'utilisateur à l'utilisateur qu'il souhaite suivre
      await prisma.followers.create({
        data: {
          userId: userId,
          followerId: followerId,
        },
      });
  
      // Utiliser NotificationController pour créer la notification
      const notificationMessage = `L'utilisateur avec l'ID ${userId} vous suit maintenant.`;
      await NotificationController.createNotification(followerId, 'followed', notificationMessage);
  
      return res
        .status(200)
        .json({ message: "Abonnement effectué avec succès" });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Erreur lors de l'abonnement", error: err });
    }
  }

  static async Followings(req: Request, res: Response) {
    const userId = req.user?.userID;
    if (!userId) {
      return res.status(401).json({
        message: "Vous devez vous connecter pour accéder à ce contenu",
      });
    }
    try {
      const followings = await prisma.followers.findMany({
        where: { userId: req.user?.userID },
        select: {
          id: true,
          // afichier les informations du user
          Users_Followers_followerIdToUsers: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              photoProfile: true,
              role: true,
              badges: true,
              credits: true,
            },
          },
        },
      });
      return res.status(200).json({ followings });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erreur lors de la récupération des followers",
        error: error,
      });
    }
  }
  
  
  
  // Méthode myFollowers
  static async myFollowers(req: Request, res: Response) {
    const userId = req.user?.userID;

    if (!userId) {
      return res.status(401).json({
        message: "Vous devez vous connecter pour accéder à ce contenu",
      });
    }

    try {
      const followers = await prisma.followers.findMany({
        where: { followerId: req.user?.userID },
        // where: { userId: req.user?.userID },
        select: {
          id: true,
          // afichier les informations du user

          Users_Followers_userIdToUsers: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              photoProfile: true,
              role: true,
              badges: true,
              credits: true,
            },
          },
        },
      });

      return res.status(200).json({ followers });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erreur lors de la récupération des followers",
        error: error,
      });
    }
  }

  static async myFollowings(req: Request, res: Response) {
    const userId = req.user?.userID;

    if (!userId) {
      return res.status(401).json({
        message: "Vous devez vous connecter pour accéder à ce contenu",
      });
    }
    try {
      const followings = await prisma.followers.findMany({
        where: { userId: req.user?.userID },
        select: {
          id: true,
          // afichier les informations du user
          Users_Followers_followerIdToUsers: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              photoProfile: true,
              role: true,
              badges: true,
              credits: true,
            },
          },
        },
      });
      return res.status(200).json({ followings });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erreur lors de la récupération des followers",
        error: error,
      });
    }
  }


  // Méthode profile
  static async profile(req: Request, res: Response) {
    const userId = req.user?.userID;
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

      const user = await prisma.users.findUnique({
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
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors de la récupération du profil",
        error: err,
      });
    }
  }

  // Méthode changeRole
  static async changeRole(req: Request, res: Response) {
    try {
      const userId = req.user?.userID;

      if (!userId) {
        return res
          .status(401)
          .send("Vous devez vous connecter pour effectuer cette action");
      }

      const user = await prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).send("Utilisateur non trouvé");
      }

      if ((user?.credits ?? 0) <= 1) {
        return res
          .status(402)
          .send("Vous n'avez pas assez de crédits pour changer de rôle");
      }

      // const newRole = user.role === "visiteur" ? "tailleur" : "visiteur";
      const newRole = req.body.newRole;
      if (newRole === user.role) {
        return res.status(400).send(`Votre profil est dèjas sur: : ${newRole}`);
      }

      const validRoles = ["tailleur", "vendeur", "visiteur"];
      if (!validRoles.includes(newRole)) {
        return res
          .status(400)
          .send("Rôle invalide, choisir parmi tailleur, vendeur ou visiteur");
      }

      const updatedUser = await prisma.users.update({
        where: { id: userId },
        data: {
          role: newRole,
          credits: { decrement: 1 },
        },
      });

      return res.status(200).send("Rôle mis à jour avec succès");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Erreur lors du changement de rôle");
    }
  }

  // Méthode bloquerUsers
// Méthode bloquerUsers
static async bloquerUsers(req: Request, res: Response) {
  const utilisateurId = Number(req.body.utilisateurId); // ID de l'utilisateur à bloquer
  const userId = req.user?.userID; // ID de l'utilisateur connecté
  const storyId = req.body.storyId; // ID de la story associée

  // Vérification si l'utilisateur est connecté
  if (!userId) {
    return res.status(401).json({
      message: "Vous devez vous connecter pour effectuer cette action",
    });
  }

  // Validation de l'ID de l'utilisateur à bloquer
  if (!utilisateurId || isNaN(utilisateurId)) {
    return res.status(400).json({ error: "ID utilisateur invalide" });
  }

  // Validation de l'ID de la story
  if (!storyId) {
    return res.status(400).json({ error: "ID de la story obligatoire" });
  }

  try {
    // Vérifier si la story existe
    const story = await prisma.stories.findUnique({
      where: { id: Number(storyId) },
    });

    if (!story) {
      return res.status(404).json({ error: "Story non trouvée" });
    }

    // Vérifier si l'utilisateur ne se bloque pas lui-même
    if (utilisateurId === userId) {
      return res
        .status(400)
        .json({ error: "Vous ne pouvez pas vous bloquer vous-même" });
    }

    // Vérifier si l'utilisateur à bloquer existe
    const userToBlock = await prisma.users.findUnique({
      where: { id: utilisateurId },
    });

    if (!userToBlock) {
      return res.status(404).json({ error: "Utilisateur à bloquer non trouvé" });
    }

    // Récupérer l'utilisateur courant avec les utilisateurs déjà bloqués
    const currentUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { BlockedUsers: true },
    });

    if (!currentUser) {
      return res.status(404).json({ error: "Utilisateur courant non trouvé" });
    }

    // Vérifier si l'utilisateur est déjà bloqué
    const alreadyBlocked = currentUser.BlockedUsers.some(
      (BlockedUsers) => BlockedUsers.id === utilisateurId
    );

    if (alreadyBlocked) {
      return res
        .status(400)
        .json({ error: "Vous avez déjà bloqué cet utilisateur" });
    }

    // Créer une entrée dans la table blockedUsers
    await prisma.blockedUsers.create({
      data: {
        storyId: Number(storyId),
        blockedUserId: utilisateurId,
      },
    });

    // Utiliser NotificationController pour créer la notification
    const notificationMessage = `Vous avez été bloqué par l'utilisateur avec l'ID ${userId}.`;
    await NotificationController.createNotification(utilisateurId, 'blocked', notificationMessage);

    return res.status(200).json({ message: "Utilisateur bloqué avec succès" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erreur interne du serveur", details: error });
  }
}



  // Méthode debloquerUsers
// Méthode debloquerUsers
static async debloquerUsers(req: Request, res: Response) {
  const utilisateurId = Number(req.body.utilisateurId); // ID de l'utilisateur à débloquer
  const userId = req.user?.userID; // ID de l'utilisateur connecté
  const storyId = req.body.storyId; // ID de la story associée

  // Vérification si l'utilisateur est connecté
  if (!userId) {
    return res.status(401).json({
      message: "Vous devez vous connecter pour effectuer cette action",
    });
  }

  // Validation de l'ID de l'utilisateur à débloquer
  if (!utilisateurId || isNaN(utilisateurId)) {
    return res.status(400).json({ error: "ID utilisateur invalide" });
  }

  // Validation de l'ID de la story
  if (!storyId) {
    return res.status(400).json({ error: "ID de la story obligatoire" });
  }

  try {
    // Vérifier si la story existe
    const story = await prisma.stories.findUnique({
      where: { id: Number(storyId) },
    });

    if (!story) {
      return res.status(404).json({ error: "Story non trouvée" });
    }

    // Vérifier si l'utilisateur ne se débloque pas lui-même
    if (utilisateurId === userId) {
      return res
        .status(400)
        .json({ error: "Vous ne pouvez pas vous débloquer vous-même" });
    }

    // Vérifier si l'utilisateur à débloquer existe
    const userToUnblock = await prisma.users.findUnique({
      where: { id: utilisateurId },
    });

    if (!userToUnblock) {
      return res
        .status(404)
        .json({ error: "Utilisateur à débloquer non trouvé" });
    }

    // Vérifier si l'utilisateur est bloqué dans la base de données
    const isBlocked = await prisma.blockedUsers.findMany({
      where: {
        AND: [
          { storyId: Number(storyId) },
          { blockedUserId: Number(utilisateurId) },
        ],
      },
    });

    if (!isBlocked || isBlocked.length === 0) {
      return res
        .status(400)
        .json({ error: "Cet utilisateur n'est pas bloqué" });
    }

    // Supprimer l'utilisateur de la table blockedUsers
    await prisma.blockedUsers.deleteMany({
      where: {
        storyId: Number(storyId),
        blockedUserId: Number(utilisateurId),
      },
    });

    // Utiliser NotificationController pour créer la notification
    const notificationMessage = `Vous avez été débloqué par l'utilisateur avec l'ID ${userId}.`;
    await NotificationController.createNotification(utilisateurId, 'unblocked', notificationMessage);

    return res.status(200).json({ message: "Utilisateur débloqué avec succès" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erreur interne du serveur", details: error });
  }
}

  // Méthode getUserBloquer
  static async getUserBloquer(req: Request, res: Response) {
    const utilisateurId = Number(req.body.utilisateurId);
    const userId = req.user?.userID;
    console.log(utilisateurId);
    if (!userId) {
      return res.status(401).json({
        message: "Vous devez vous connecter pour effectuer cette action",
      });
    }

    try {
      const currentUser = await prisma.users.findUnique({
        where: { id: userId },
        include: { BlockedUsers: true },
      });

      if (!currentUser) {
        return res
          .status(404)
          .json({ error: "Utilisateur courant non trouvé" });
      }

      const userToBlock = await prisma.users.findUnique({
        where: { id: Number(userId) },
        include: { BlockedUsers: true },
      });
      if (!userToBlock) {
        return res
          .status(404)
          .json({ error: "Utilisateur à bloquer non trouvé" });
      }
      const isBlocked = await prisma.blockedUsers.findMany({
        where: {
          AND: [{ blockedUserId: Number(utilisateurId) }],
        },
      });
      return res.status(200).json({ isBlocked });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erreur interne du serveur", details: error });
    }
  }

  static async updateNote(req: Request, res: Response) {
    const { id, noteId } = req.params;
    const { rate } = req.body;

    // Validate rate
    if (typeof rate !== "number" || rate < 1 || rate > 5) {
      return res
        .status(400)
        .json({ error: "La note doit être un nombre entre 1 et 5" });
    }

    try {
      const userToRate = await prisma.users.findUnique({
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

      const raterId = req.user?.userID;

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

      const existingNote = await prisma.usersNotes.findUnique({
        where: {
          id: parseInt(noteId, 10),
          raterID: raterId,
          userId: userToRate.id,
        },
      });

      if (!existingNote) {
        return res.status(404).json({
          error:
            "Note non trouvée ou vous n'avez pas la permission de la modifier",
        });
      }

      const updatedNote = await prisma.usersNotes.update({
        where: { id: existingNote.id },
        data: { rate },
      });

      res
        .status(200)
        .json({ message: "Note mise à jour avec succès", updatedNote });
    } catch (error) {
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  static async chargeCredit(req: Request, res: Response) {
    try {
      // Récupérer l'utilisateur connecté
      const connectedUser = await prisma.users.findUnique({
        where: { id: req.user!.userID },
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
      } else if (![1000, 2000, 3000].includes(comparedAmount)) {
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
      await prisma.users.update({
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  static async updateMeasurements(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.params.userId; // ID de l'utilisateur cible dans l'URL
      const connectedUserId = req.user?.userID;

      if (!connectedUserId) {
        return res.status(401).json({
          error: "Vous devez être connecté pour effectuer cette action.",
        });
      }

      // Vérifier que l'utilisateur connecté est un tailleur
      const connectedUser = await prisma.users.findUnique({
        where: { id: connectedUserId },
      });

      if (!connectedUser || connectedUser.role !== "tailleur") {
        return res.status(403).json({
          error: "Vous n'êtes pas autorisé à effectuer cette action.",
        });
      }

      // Vérifier que l'utilisateur cible existe
      const user = await prisma.users.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }

      const measurements = req.body;

      const fieldsToFloat = [
        "cou",
        "longueurPantallon",
        "epaule",
        "longueurManche",
        "hanche",
        "poitrine",
        "cuisse",
        "longueur",
        "tourBras",
        "tourPoignet",
        "ceinture",
      ];

      for (const field of fieldsToFloat) {
        if (measurements[field]) {
          measurements[field] = parseFloat(measurements[field]);
        }
      }

      // Mettre à jour les mesures de l'utilisateur
      const updatedUser = await prisma.mesures.update({
        where: { UserID: Number(userId) },
        data: measurements,
      });

      return res.status(200).json({
        message: "Mesures mises à jour avec succès.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur interne du serveur." });
    }
  }

  //addMesure
  //addMesure
  // Add or update measurements

  //addMesure
  // Add or update measurements
  static async addMesure(req: Request, res: Response) {
    try {
      const userId = req.params.userId; // L'ID de l'utilisateur à partir de l'URL
      const connectedUserId = req.user?.userID; // ID de l'utilisateur connecté

      if (!connectedUserId) {
        return res.status(401).json({
          error: "Vous devez être connecté pour effectuer cette action.",
        });
      }

      // Vérifier que l'utilisateur connecté est un tailleur
      const connectedUser = await prisma.users.findUnique({
        where: { id: connectedUserId },
      });

      if (!connectedUser || connectedUser.role !== "tailleur") {
        return res.status(403).json({
          error: "Vous n'êtes pas autorisé à effectuer cette action.",
        });
      }

      // Vérifier que l'utilisateur cible existe
      const user = await prisma.users.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }

      // Vérification des mesures envoyées
      const measurements = req.body;

      const fieldsToFloat = [
        "cou",
        "longueurPantallon",
        "epaule",
        "longueurManche",
        "hanche",
        "poitrine",
        "cuisse",
        "longueur",
        "tourBras",
        "tourPoignet",
        "ceinture",
      ];

      for (const field of fieldsToFloat) {
        if (measurements[field]) {
          measurements[field] = parseFloat(measurements[field]);
        }
      }

      // Check if measurements already exist for this user
      const existingMeasurements = await prisma.mesures.findUnique({
        where: { UserID: Number(userId) },
      });

      let result;

      if (existingMeasurements) {
        // If measurements exist, update them
        result = await prisma.mesures.update({
          where: { UserID: Number(userId) },
          data: measurements,
        });

        return res.status(200).json({
          message: "Mesures mises à jour avec succès.",
          data: result,
        });
      } else {
        // Otherwise, create new measurements
        result = await prisma.mesures.create({
          data: {
            ...measurements,
            UserID: Number(userId),
          },
        });

        return res.status(201).json({
          message: "Mesures ajoutées avec succès.",
          data: result,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur interne du serveur." });
    }
  }

  // Find user by name
  static async findByName(req: Request, res: Response) {
    try {
      const name = req.query.name;

      if (!name) {
        return res.status(400).json({ error: "Nom d'utilisateur requis." });
      }

      const user = await prisma.users.findFirst({
        where: { nom: String(name) },
      });

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur interne du serveur." });
    }
  }

  static async acheterBadge(req: Request, res: Response) {
    const userId = req.user?.userID;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    try {
      // Vérifier si l'utilisateur existe
      const userData = await prisma.users.findUnique({
        where: { id: userId },
        select: {
          credits: true,
          badges: true,
          Followers_Followers_userIdToUsers: true,
        },
      });

      if (!userData) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const { credits, badges, Followers_Followers_userIdToUsers } = userData;
      const followersCount = Followers_Followers_userIdToUsers.length; // Compter le nombre de followers

      // Vérifier si l'utilisateur a au moins 100 followers
      if (followersCount < 1) {
        return res.status(403).json({
          message:
            "Vous devez avoir au moins 100 followers pour acheter un badge",
        });
      }

      // Vérifier si le badge est déjà acquis
      if (badges) {
        // badges est un booléen, donc juste vérifiez s'il est vrai
        return res.status(405).json({ message: "Badge déjà acquis" });
      }

      // Vérifier si l'utilisateur a suffisamment de crédits
      if (credits === null || credits < 5) {
        return res.status(406).json({ message: "Crédit insuffisant" });
      }

      // Ajouter le badge en utilisant une approche différente
      await prisma.users.update({
        where: { id: userId },
        data: {
          credits: { decrement: 5 }, // Décrémenter les crédits
          badges: true, // Définir le badge comme acquis
          certificat: true, // Définir le certificat comme acquis
        },
      });

      res.status(200).json({ message: "Badge acquis avec succès" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Une erreur est survenue" });
    } finally {
      await prisma.$disconnect();
    }
  }

  //En tant que vendeur je peut acheter un badge
  static async acheterBadgeVandeur(req: Request, res: Response) {
    const userId = req.user?.userID;
    const VandeurId = req.body.VandeurId;

    console.log(userId);
    console.log(VandeurId);
    if (!userId || !VandeurId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    try {
      // Vérifier si l'utilisateur a le droit d'acheter un badge
      const userVendeurData = await prisma.users.findUnique({
        where: { id: userId },
        select: {
          role: true,
          badges: true,
          Followers_Followers_userIdToUsers: true,
        },
      });

      if (!userVendeurData) {
        return res
          .status(404)
          .json({ error: "Utilisateur vendeur non trouvé" });
      }

      const { role, badges } = userVendeurData;

      if (role !== "vendeur") {
        return res.status(403).json({
          message: "Vous devez être un vendeur pour acheter un badge",
        });
      }

      if (badges) {
        return res
          .status(405)
          .json({ message: "Vous avez déjà acheté un badge" });
      }

      // Compter le nombre de follower du vandeur
      const followersVendeurCount =
        userVendeurData.Followers_Followers_userIdToUsers.length;

      // Vérifier si l'utilisateur a au moins 100 followers
      if (followersVendeurCount < 10) {
        return res.status(403).json({
          message:
            "Vous devez avoir au moins 100 followers pour acheter un badge",
        });
      }
      // Vérifier si
      // Vérifier si l'utilisateur vendeur a suffisamment de crédits
      const userAcheteurData = await prisma.users.findUnique({
        where: { id: Number(VandeurId) },
        select: {
          credits: true,
          Followers_Followers_userIdToUsers: true,
        },
      });
      if (
        !userAcheteurData ||
        userAcheteurData.credits === null ||
        userAcheteurData.credits < 10
      ) {
        return res
          .status(406)
          .json({ message: "Acheteur sans crédits suffisants" });
      }

      // Ajouter le badge en utilisant une approche différente
      await prisma.users.update({
        where: { id: Number(VandeurId) },
        data: {
          credits: { decrement: 10 }, // Décrémenter les crédits
        },
      });
      await prisma.users.update({
        where: { id: userId },
        data: {
          badges: true, // Définir le badge comme acquis
        },
      });
      res.status(200).json({ message: "Badge acheté avec succès" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de l'achat du badge" });
    }
  }

  static async getTailleurs(req: Request, res: Response) {
    try {
      const tailleurs = await prisma.users.findMany({
        where: { role: "tailleur" },
      });
      res.status(200).json(tailleurs);
    } catch (error) {
      res.status(500).json({ message: "Erreur récupération liste tailleurs" });
    }
  }

  static async myPosition(req: Request, res: Response): Promise<void> {
    // console.log(TEST");
    try {
      const connectedUser = await prisma.users.findUnique({
        where: { id: req.user!.userID }, // Assurez-vous que `req.user.userID` est correct
      });

      console.log(connectedUser);

      if (!connectedUser || connectedUser.role !== "tailleur") {
        res
          .status(400)
          .json({ message: "Vous n'êtes pas connecté en tant que tailleur" });
        return;
      }

      const allUsers = await prisma.users.findMany({
        where: { role: "tailleur" },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          photoProfile: true,
          role: true,
          UsersNotes_UsersNotes_userIdToUsers: {
            // Utilisation de la relation correcte
            select: {
              rate: true,
            },
          },
        },
      });

      const ranking = allUsers.map((user) => {
        const averageRate =
          user.UsersNotes_UsersNotes_userIdToUsers.reduce(
            (acc, note) => acc + note.rate!,
            0
          ) / user.UsersNotes_UsersNotes_userIdToUsers.length || 0;
        return {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          photoProfile: user.photoProfile,
          role: user.role,
          averageRate,
        };
      });

      ranking.sort((a, b) => b.averageRate - a.averageRate);

      let rank = 1;
      let previousRate: number | null = null;
      let tiedUsersCount = 0;

      for (const element of ranking) {
        if (previousRate === element.averageRate) {
          tiedUsersCount++;
        } else {
          rank += tiedUsersCount;
          tiedUsersCount = 1;
        }

        // element.rank = rank;
        previousRate = element.averageRate;

        if (element.id === connectedUser.id) {
          res.status(200).send(`Votre classement est ${rank}`);
          return;
        }
      }

      res
        .status(404)
        .json({ message: "Utilisateur non trouvé dans le classement" });
    } catch (err) {
      res.status(500).json({ message: `Erreur: ${(err as Error).message}` });
    }
  }

  static async getTailleurRanking(req?: Request, res?: Response): Promise<Tailleur[]> {
    try {
        const tailleurs = await prisma.users.findMany({
            where: { role: "tailleur" },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                photoProfile: true,
                role: true,
                UsersNotes_UsersNotes_userIdToUsers: {
                    select: {
                        rate: true,
                    },
                },
            },
        });

        const ranking: Tailleur[] = tailleurs.map((tailleur) => {
            const averageRate =
                tailleur.UsersNotes_UsersNotes_userIdToUsers.reduce(
                    (acc, note) => acc + note.rate!,
                    0
                ) / tailleur.UsersNotes_UsersNotes_userIdToUsers.length || 0;

            return {
                id: tailleur.id,
                nom: tailleur.nom,
                prenom: tailleur.prenom,
                email: tailleur.email,
                photoProfile: tailleur.photoProfile,
                role: tailleur.role,
                averageRate,
                rank: 0, // Initial value
            };
        });

        // Sort by average rate
        ranking.sort((a, b) => b.averageRate - a.averageRate);

        // Assign ranks
        let rank = 1;
        let previousRate: number | null = null;
        let tiedUsersCount = 0;

        ranking.forEach((tailleur, index) => {
            if (previousRate === tailleur.averageRate) {
                tiedUsersCount++;
            } else {
                rank += tiedUsersCount;
                tiedUsersCount = 1;
            }

            tailleur.rank = rank;
            previousRate = tailleur.averageRate;
        });

        // If res is defined, send the response (used for direct requests to get ranking)
        if (res) {
            res.status(200).json(ranking);
        }
        
        return ranking;
    } catch (error) {
        if (res) {
            res.status(500).json({
                message: `Erreur lors de la récupération du classement des tailleurs: ${(error as Error).message}`,
            });
        }
        return []; // Return an empty array in case of an error
    }
  }

  static async getStatistiques(req: Request, res: Response) {
    const connectedUser = await prisma.users.findUnique({
        where: { id: req.user!.userID },
        include: { UsersMesModels: true, CommandeModels: true },
    });

    if (!connectedUser || connectedUser.status?.toLowerCase() !== "premium") {
        return res.status(401).json({
            message: "Vous devez être premium pour effectuer cette action",
        });
    }

    try {
        // Get the most sold model
        const mostSoldModel = connectedUser.UsersMesModels.sort(
            (a, b) => (b.nombreDeCommande ?? 0) - (a.nombreDeCommande ?? 0)
        )[0];

        // Get the most viewed posts
        const mostViewedPosts = await prisma.posts.findMany({
            where: { utilisateurId: connectedUser.id },
            orderBy: { vues: "desc" },
        });

        // Calculate the sales to posts ratio
        const userSalesCount = connectedUser.CommandeModels.length;
        const userPostsCount = await prisma.posts.count({
            where: { utilisateurId: connectedUser.id },
        });

        const salesToPostsRatio = userPostsCount > 0 ? (userSalesCount / userPostsCount) : 0;

        // Get followers and followings count
        const userFollowersCount = await prisma.followers.count({
            where: { followerId: connectedUser.id },
        });

        const userFollowingsCount = await prisma.followers.count({
            where: { userId: connectedUser.id },
        });

        const tailleursPostsCount = await prisma.posts.count({
            where: { utilisateurId: connectedUser.id },
        });

        // Get total likes
        const postsWithLikes = await prisma.posts.findMany({
            where: { utilisateurId: connectedUser.id },
            include: { Likes: true },
        });

        const totalLikes = postsWithLikes.reduce((acc, post) => acc + (post.Likes.length || 0), 0);

        // Get tailleur ranking (do not return the response in getTailleurRanking)
        const tailleurRanking: Tailleur[] = await this.getTailleurRanking();
        const tailleurRank = tailleurRanking.find((tailleur) => tailleur.id === connectedUser.id)?.rank || null;

        // Send the statistics response
        res.status(200).json({
            mostSoldModel,
            mostViewedPosts,
            salesToPostsRatio: (salesToPostsRatio * 100).toFixed(2) + "%",
            tailleursPostsCount,
            userFollowersCount,
            userFollowingsCount,
            totalLikes,
            tailleurRank,
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
  }

  static async filterTailleurById(req: Request, res: Response) {
    const { tailleurId } = req.params;
    try {
      const tailleur = await prisma.users.findUnique({
        where: { id: parseInt(tailleurId, 10) },
      });

      if (!tailleur || tailleur.role !== "tailleur") {
        return res.status(404).json({ message: "Tailleur non trouvé" });
      }

      return res.status(200).json(tailleur);
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur : " + error });
    }
  }

  static async filterByName(req: Request, res: Response) {
    const { name } = req.params;
    try {
      const tailleurs = await prisma.users.findMany({
        where: {
          role: "tailleur",
          nom: {
            contains: name,
          },
        },
      });

      if (tailleurs.length === 0) {
        return res.status(404).json({ message: "Tailleur non trouvé" });
      }

      return res.status(200).json(tailleurs);
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur : " + error });
    }
  }

  //filterTailleurByCertificat
  static async filterTailleurByCertificat(req: Request, res: Response) {
    //je veut filtrer les users qui ont le role tailleur et qui ont le certificat
    try {
      const filteredUsers = await prisma.users.findMany({
        where: { certificat: true },
      });
      if (!filteredUsers) {
        return res.status(404).json({ error: "Aucun utilisateur trouvé" });
      }

      res.status(200).json(filteredUsers);
    } catch (error) {
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }
  // Fonction pour obtenir le solde (credits) de l'utilisateur connecté
static  getBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userID; // Assurez-vous que l'objet `req.user` contient l'ID utilisateur
    if (!userId) {
      res.status(401).json({ error: 'Utilisateur non authentifié' });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { credits: true }, // Récupère uniquement les crédits
    });

    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    res.json({ balance: user.credits || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

  static async getConnectedUser(req: Request, res: Response) {
    try {
      const userId = req.user!.userID;

      console.log(userId);

      if (!userId) {
        return res.status(401).json({
          message: "Vous devez vous connecter pour effectuer cette action",
        });
      }

      res.status(200).json(userId);
    } catch (err) {
      console.error(err);
    }
  }

  static async abonnementPremium(req: Request, res: Response) {
    const userId = req.user?.userID;// ID de l'utilisateur connecté via token/session

    try {
      // Récupérer l'utilisateur et ses followers
      const user = await prisma.users.findUnique({
        where: { id: userId},
        include: {
          Followers_Followers_userIdToUsers: true, // Inclure les followers de l'utilisateur
        },
      });

      // Vérifier si l'utilisateur existe
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      // Vérifier si l'utilisateur est un tailleur
      if (user.role !== 'tailleur') {
        return res.status(403).json({ message: "Seuls les tailleurs peuvent s'abonner au service premium." });
      }

      // Vérifier si l'utilisateur est déjà premium
      if (user.status === 'premium') {
        return res.status(400).json({ message: "Vous êtes déjà abonné au service premium." });
      }

      // Vérifier le nombre de followers
      const followerCount = user.Followers_Followers_userIdToUsers.length;
      if (followerCount < 1) {
        return res.status(400).json({ message: "Vous devez avoir au moins 10 followers pour vous abonner au service premium." });
      }

      // Gérer le cas où user.credits est null
      const userCredits = user.credits ?? 0; // Utilise 0 si user.credits est null

      // Vérifier les crédits
      if (userCredits < 5) {
        return res.status(400).json({ message: "Vous n'avez pas assez de crédits. Il vous faut au moins 5 crédits pour vous abonner." });
      }

      // Si les conditions sont remplies, déduire 5 crédits et mettre à jour le statut à "premium"
      const updatedUser = await prisma.users.update({
        where: { id: userId },
        data: {
          credits: userCredits - 5,
          status: 'premium',
        },
      });

      return res.status(200).json({
        message: "L'abonnement premium a été réussi avec succès.",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de l'abonnement premium." });
    }
  }
}
