import express from "express";
import UserController from "../controllers/UserController.js";
import auth from "../middlewares/auth.js";
import ModelController from "../controllers/ModelController.js";
import PostController from "../controllers/PostController.js";
import StoryController from '../controllers/StoryController.js';

import { likePost, unlikePost, getPostLikes } from '../controllers/LikeController.js';
import { dislikePost, getPostDislike, undislikePost } from "../controllers/DislikeController.js";

import { getPostComments, addComment, deleteComment } from '../controllers/CommentController.js';


const router = express.Router();

// Routes de l'utilisateur
router.route("/register").post((req, res) => UserController.create(req, res));
router.route("/login").post((req, res) => UserController.login(req, res));
router.route("/logout").post((req, res) => UserController.logout(req, res));
router.route("/test").get(auth, (req, res) => UserController.test(req, res));

router.get('/classement', UserController.getTailleurRanking);
// FOLLOW USER

// Routes pour suivre/désuivre des utilisateurs
router.route("/follow/:id").post((req, res) => UserController.followUser(req, res));
router.route("/unfollow/:id").post((req, res) => UserController.unfollowUser(req, res));
router.route('/add-note/:id').post(auth, (req, res) => UserController.addNote(req, res));
router.route('/signal/:id').post(auth, (req, res) => UserController.reportUser(req, res));

// Routes pour les modèles
router.route('/model/create').post(auth, (req, res) => ModelController.create(req, res));


// Routes pour les posts
router.route('/post/create').post(auth, (req, res) => PostController.create(req, res));
router.route('/post').get(auth, (req, res) => PostController.getAllPosts(req, res));
router.route('/post/:id').get(auth, (req, res) => PostController.getPostById(req, res));
router.route('/post/:id/model').get(auth, (req, res) => PostController.getModel(req, res));
router.route('/post/favorite/create/:id').post(auth, (req, res) => PostController.addFavorite(req, res));

// Routes pour les histoires
router.route('/story/create').post(auth, StoryController.createStory);


// Routes pour les likes
router.post('/post/:postId/like', auth, likePost);
router.post('/post/:postId/like/:likeID/unlike',auth, unlikePost);
router.get('/post/:postId/likes',auth, getPostLikes);

// Routes pour les dislikes
router.post('/post/:postId/Dislike',auth, dislikePost);
router.post('/post/:postId/dislike/:dislikeID/undislike',auth, undislikePost);
router.get('/post/:postId/Dislike',auth, getPostDislike);


router
  .route("/add-note/:id")
  .post(auth, (req, res) => UserController.addNote(req, res));

router
  .route("/signal/:id")
  .post(auth, (req, res) => UserController.reportUser(req, res));

// Model routes
router
  .route("/model/create")
  .post(auth, (req, res) => ModelController.create(req, res));

// Post routes
router
  .route("/post/create")
  .post(auth, (req, res) => PostController.create(req, res));


router.route('/post/favorite/create/:id')
    .post(auth, (req, res) => PostController.addFavorite(req, res));

// Route pour supprimer un favori
router.route('/post/favorite/remove/:id')
    .delete(auth, (req, res) => PostController.removeFavorite(req, res));

router
  .route("/post")
  .get(auth, (req, res) => PostController.getAllPosts(req, res));

router
  .route("/post/:id")
  .get(auth, (req, res) => PostController.getPostById(req, res));

router
  .route("/post/:id/model")
  .get(auth, (req, res) => PostController.getModel(req, res));


// Story routes
router.route("/story/create").post(auth, StoryController.createStory);

router
  .route("/profile")
  .get(auth, (req, res) => UserController.profile(req, res));

router
  .route("/post/favorite/create/:id")
  .post(auth, (req, res) => PostController.addFavorite(req, res));

router
  .route("/post")
  .get(auth, (req, res) => PostController.getAllPosts(req, res));

router
  .route("/post/:id")
  .get(auth, (req, res) => PostController.getPostById(req, res));

router.route('/post/:id')
    .delete(auth, (req, res) => PostController.deletePost(req, res));

router.route('/post/:postId/share')
    .post(auth, (req, res) => PostController.partagerPost(req, res));


router
  .route("/post/:id/model")
  .get(auth, (req, res) => PostController.getModel(req, res));


router.route("/test").get(auth, (req, res) => UserController.test(req, res));


// Route pour aimer un post
/* router.post('/post/:postId/like', likePost); */
router.post("/post/:postId/like", auth, likePost);

// Route pour ne pas aimer un post
router.post("/post/:postId/like/:likeID/unlike", auth, unlikePost);

// Route pour récupérer les likes d'un post
router.get("/post/:postId/likes", auth, getPostLikes);

// ROUTE POUR AFFICHER LES FOLLOWERS D'UN TAILLEUR:
router
  .route("/post/myFollowers")
  .post(auth, (req, res) => UserController.myFollowers(req, res));

// ROUTE POUR VOIR LE CLASSEMENT DU TAILLEUR:
router
  .route("/post/myPosition")
  .post(auth, (req, res) => UserController.myPosition(req, res));

/*
Moustaph:2 postion:4
Fat: 2 position:4
khadia: 4 position: 2
Bamba: 4 position: 1
Faly: 0: position: 0
*/

// Route pour disliker un post
router.post('/post/:postId/Dislike', auth, dislikePost);

// Route pour retirer un dislike
router.post('/post/:postId/dislike/:dislikeID/undislike', auth, undislikePost);
// Route pour afficher les dislikes
router.get('/post/:postId/Dislike', auth, getPostDislike);


// Routes pour les commentaires
router.post('/post/:postId/comment', auth, addComment);
router.delete('/comment/:commentId', auth, deleteComment);
router.get('/post/:postId/comments', auth, getPostComments);

export default router;