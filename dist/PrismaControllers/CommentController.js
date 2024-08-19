var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Comment from '../models/CommentModel';
import Post from '../models/PostModel';
import User from '../models/UserModel';
// Ajouter un commentaire sur un post
export const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.user.id);
        const post = yield Post.findById(req.params.postId);
        if (!post) {
            res.status(400).json({ msg: 'Post non trouvé' });
            return;
        }
        const newComment = new Comment({
            users: req.user.id,
            post: req.params.postId,
            content: req.body.content, // Assurez-vous que le contenu du commentaire est fourni dans le corps de la requête
        });
        yield newComment.save();
        if (!post.comments) {
            post.comments = []; // Initialiser le tableau si nécessaire
        }
        post.comments.push(newComment._id); // Ajouter l'ID du commentaire au tableau de commentaires
        yield post.save();
        res.status(201).json(newComment);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});
// Supprimer un commentaire sur un post
export const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield Comment.findById(req.params.commentId);
        if (!comment) {
            res.status(404).json({ msg: 'Commentaire non trouvé' });
            return;
        }
        const post = yield Post.findById(comment.post);
        if (comment.users.toString() !== req.user.id && !(post === null || post === void 0 ? void 0 : post.user.equals(req.user.id))) {
            res.status(401).json({ msg: 'Vous n\'êtes pas l\'auteur de ce commentaire' });
            return;
        }
        yield Comment.findByIdAndRemove(req.params.commentId);
        if (post) {
            post.comments = post.comments.filter((commentId) => commentId.toString() !== req.params.commentId);
            yield post.save();
        }
        res.json({ msg: 'Commentaire supprimé' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});
// Récupérer les commentaires d'un post
export const getPostComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post.findById(req.params.postId).populate('comments');
        if (!post) {
            res.status(404).json({ msg: 'Post non trouvé' });
            return;
        }
        res.json(post.comments);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});
