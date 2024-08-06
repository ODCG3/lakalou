import Like from '../models/LikeModel.js';
import Post from '../models/PostModel.js'; // Assurez-vous que c'est le bon chemin pour le modèle Post
import User from '../models/UserModel.js'; // Assurez-vous que c'est le bon chemin pour le modèle User

// Ajouter un like
export const likePost = async (req, res) => {
    try {
        const { postId } = req.params; // Récupérer l'ID du post depuis l'URL
        const userId = req.user._id; // Récupérer l'ID de l'utilisateur connecté depuis le token ou session

        // Vérifier si l'utilisateur a déjà aimé le post
        const existingLike = await Like.findOne({ user: userId, post: postId });

        if (existingLike) {
            return res.status(400).json({ message: 'Vous avez déjà aimé ce post.' });
        }

        // Créer un nouveau like
        const like = new Like({ user: userId, post: postId });
        await like.save();

        // Optionnel : Mettre à jour le nombre de likes dans le post
        await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

        res.status(201).json({ message: 'Post aimé avec succès.', like });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error });
    }
};

// Retirer un like
export const unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        // Trouver et supprimer le like
        const like = await Like.findOneAndDelete({ user: userId, post: postId });

        if (!like) {
            return res.status(400).json({ message: 'Vous n\'avez pas aimé ce post.' });
        }

        // Optionnel : Mettre à jour le nombre de likes dans le post
        await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

        res.status(200).json({ message: 'Like retiré avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error });
    }
};

// Récupérer tous les likes d'un post
export const getPostLikes = async (req, res) => {
    try {
        const { postId } = req.params;

        const likes = await Like.find({ post: postId }).populate('user', 'username email'); // Populate pour obtenir les détails de l'utilisateur

        res.status(200).json({ likes });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error });
    }
};
