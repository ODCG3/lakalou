import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail.js';
import { validateImageExtension, validateName } from '../utils/Validator.js';
import { Request, Response } from 'express';
import { Error } from 'mongoose';


const prisma = new PrismaClient();

export default class PrismaUserController {
  static async create(req:Request, res:Response) {
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
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(407).json({ error: "Cet email est déjà utilisé" });
      }

      const user = await prisma.users.create({
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
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async login(req:Request, res:Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Tous les champs sont obligatoires' });
    }

    try {
      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: 'Utilisateur inconnu' });
      }

      const userPassword = user?.password

      const isValidPassword = await bcrypt.compare(password, userPassword!);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }

      const token = jwt.sign({ userID: user.id }, process.env.TokenKey as string);

      res.cookie('token', token, {
        httpOnly: true,
        // secure: true, // Uncomment if using HTTPS
        path: '/',
      });

      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }

  static logout(req:Request, res:Response) {
    res.clearCookie('token', {
      // secure: true, // Uncomment if using HTTPS
      httpOnly: true,
      path: '/',
    });

    res.status(200).json('Déconnexion réussie');
  }
  //addNote
  static async addNotes(req: Request, res: Response) {
    const { id } = req.params;
    const { rate } = req.body;

    // Validate rate
    if (typeof rate !== 'number' || rate < 1 || rate > 5) {
      return res.status(400).json({ error: 'La note doit être un nombre entre 1 et 5' });
    }

    try {
      const userToRate = await prisma.users.findUnique({
        where: { id: parseInt(id, 10) },
        include: { UsersNotes_UsersNotes_raterIDToUsers: true },
      });

      if (!userToRate) {
        return res.status(403).json({ error: 'Utilisateur non trouvé' });
      }

      if (userToRate.role !== 'tailleur') {
        return res.status(402).json({ error: 'Vous ne pouvez pas noter un visiteur' });
      }

      const raterId = req.user?.userID;

      if (!raterId) {
        return res.status(403).json({ error: "Connectez-vous d'abord pour noter" });
      }

      if (userToRate.id === raterId) {
        return res.status(400).json({ error: 'Vous ne pouvez pas vous noter vous-même' });
      }

      const existingNote = userToRate.UsersNotes_UsersNotes_raterIDToUsers.find(
        (note) => note.raterID === raterId
      );

      if (existingNote) {
        return res.status(400).json({ error: 'Vous avez déjà noté cet utilisateur' });
      }

      const note = await prisma.usersNotes.create({
        data: {
          rate,
          raterID: raterId,
          userId: userToRate.id,
        },
      });

      res.status(200).json({ message: 'Note ajoutée avec succès', note });
    } catch (error) {
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }

  static async updateNote(req: Request, res: Response) {
    const { id, noteId } = req.params;
    const { rate } = req.body;

    // Validate rate
    if (typeof rate !== 'number' || rate < 1 || rate > 5) {
        return res.status(400).json({ error: 'La note doit être un nombre entre 1 et 5' });
    }

    try {
        const userToRate = await prisma.users.findUnique({
            where: { id: parseInt(id, 10) },
            include: { UsersNotes_UsersNotes_raterIDToUsers: true },
        });

        if (!userToRate) {
            return res.status(403).json({ error: 'Utilisateur non trouvé' });
        }

        if (userToRate.role !== 'tailleur') {
            return res.status(402).json({ error: 'Vous ne pouvez pas noter un visiteur' });
        }

        const raterId = req.user?.userID;

        if (!raterId) {
            return res.status(403).json({ error: "Connectez-vous d'abord pour modifier une note" });
        }

        if (userToRate.id === raterId) {
            return res.status(400).json({ error: 'Vous ne pouvez pas vous noter vous-même' });
        }

        const existingNote = await prisma.usersNotes.findUnique({
            where: { id: parseInt(noteId, 10), raterID: raterId, userId: userToRate.id },
        });

        if (!existingNote) {
            return res.status(404).json({ error: "Note non trouvée ou vous n'avez pas la permission de la modifier" });
        }

        const updatedNote = await prisma.usersNotes.update({
            where: { id: existingNote.id },
            data: { rate },
        });

        res.status(200).json({ message: 'Note mise à jour avec succès', updatedNote });
    } catch (error) {
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }

}
