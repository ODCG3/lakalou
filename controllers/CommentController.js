import Comment from '../models/CommentModel.js';
import Post from '../models/PostModel.js';
import User from '../models/UserModel.js';

// Ajouter un commentaire sur un post
export const addComment = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const post = await Post.findById(req.params.postId);

        if (!post) return res.status(400).json({ msg: 'Post non trouvé' });

        const newComment = new Comment({
            users: req.user.id,
            post: req.params.postId,
            content: req.body.content // Assurez-vous que le contenu du commentaire est fourni dans le corps de la requête
        });

        await newComment.save();

        if (!post.comments) {
            post.comments = []; // Initialiser le tableau si nécessaire
        }

        
        post.commentaires.push(newComment._id); // Ajouter l'ID du commentaire au tableau de commentaires
        await post.save();

        res.status(201).json(newComment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Supprimer un commentaire sur un post
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) return res.status(404).json({ msg: 'Commentaire non trouvé' });

        const post = await Post.findById(comment.post);

        if (comment.users.toString() !== req.user.id && !post.user.equals(req.user.id))
            return res.status(401).json({ msg: 'Vous n\'êtes pas l\'auteur de ce commentaire' });

        await Comment.findByIdAndRemove(req.params.commentId);

        post.commentaires = post.commentaires.filter(
            (commentId) => commentId.toString() !== req.params.commentId
        );
        await post.save();

        res.json({ msg: 'Commentaire supprimé' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Récupérer les commentaires d'un post
export const getPostComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate('comments');

        if (!post) return res.status(404).json({ msg: 'Post non trouvé' });

        res.json(post.commentaires);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};
