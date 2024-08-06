import Dislike from '../models/DislikeModel.js';
import Post from '../models/PostModel.js'; // Assurez-vous que c'est le bon chemin pour le modèle Post
import User from '../models/UserModel.js'; // Assurez-vous que c'est le bon chemin pour le modèle User

//disliker un posr qui n'a ni etait liker, ni disliker
export const dislikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userID;

        const existingDislike = await Dislike.findOne({ user: userId, post: postId });

        if (existingDislike) {
            return res.status(400).json({ message: 'Vous avez déjà disaimé ce post.' });
        }

        const dislike = new Dislike({ user: userId, post: postId });
        await dislike.save();

        const post = await Post.findById(postId);
        post.dislikes.push(userId);
        await post.save();

        res.status(201).json({ message: 'Post disaimé avec succès.', dislike });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error });
    }
}
// Retirer un dislike
export const undislikePost = async (req, res) => {
    try {
        const { postId, dislikeID } = req.params;
        const userId = req.user.userID;

        const dislikeExist = await Dislike.findById(dislikeID);

        if (!dislikeExist) {
            return res.status(400).json({ message: 'Vous n\'avez pas disaimé ce post.' });
        }

        const dislike = await Dislike.findOneAndDelete({ _id: dislikeID, post: postId });

        const post = await Post.findById(postId);

        post.dislikes = post.dislikes.filter((dislike) =>!dislike.equals(userId));

        await post.save();

        res.status(200).json({ message: 'Dislike retiré avec succès.', data: { dislike, post } });
    } catch (error){
        res.status(500).json({ message: 'Erreur du serveur.', error });
    };
}

export const getPostDislike = async (req, res) => {
    try {
        const { postId } = req.params;

        const Dislikes = await Dislike.find({ post: postId });

        res.status(200).json({ Dislikes });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error });
    }
};