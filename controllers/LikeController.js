import Like from '../models/LikeModel.js';
import Post from '../models/PostModel.js'; // Assurez-vous que c'est le bon chemin pour le modèle Post
import User from '../models/UserModel.js'; // Assurez-vous que c'est le bon chemin pour le modèle User

// Ajouter un like
export const likePost = async (req, res) => {
    try {
        const { postId } = req.params; // Récupérer l'ID du post
        const userId = req.user.userID; // Récupérer l'ID de l'utilisateur depuis le token

        // Vérifier si l'utilisateur a déjà liké le post
        const existingLike = await Like.findOne({ user: userId, post: postId });

        if (existingLike) {
            return res.status(400).json({ message: 'Vous avez déjà aimé ce post.' });
        }

        // Créer un nouveau like
        const like = new Like({ user: userId, post: postId });
        await like.save();

        const post = await Post.findById(postId);
        post.likes.push(userId);
        await post.save();


        // Envoyer un message de succès
        res.status(200).json({ message: 'Post aimé avec succès.', like });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error });
    }
};

// Retirer un like
export const unlikePost = async (req, res) => {
    try {
        const { postId, likeID } = req.params;
        const userId = req.user.userID;

        const likeExist = await Like.findById(likeID);
        console.log(likeExist);


        if (!likeExist) {
            return res.status(400).json({ message: 'Vous n\'avez pas aimé ce post.' });
        }

        const like = await Like.findOneAndDelete({ _id: likeID, post: postId });

        const post = await Post.findById(postId);

        post.likes = post.likes.filter((like) => !like.equals(userId));

        // Sauvegarder le document mis à jour
        await post.save();

        res.status(200).json({ message: 'Like retiré avec succès.', data: { like, post } });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error });
    }
};

// Récupérer tous les likes d'un post
export const getPostLikes = async (req, res) => {
    try {
        const { postId } = req.params;

        const likes = await Like.find({ post: postId });

        res.status(200).json({ likes });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error });
    }
};
