import express from "express";
import UserController from "../controllers/UserController.js";
import auth from "../middlewares/auth.js";
import ModelController from "../controllers/ModelController.js";
import PostController from "../controllers/PostController.js";

import StoryController from '../controllers/StoryController.js';


import { likePost, unlikePost, getPostLikes } from '../controllers/LikeController.js';
import { dislikePost, getPostDislike, undislikePost } from "../controllers/DislikeController.js";

import { getPostComments, addComment, deleteComment } from '../controllers/CommentController.js';
import { createCommande, getCommandesByPostId, getCommandeById } from '../controllers/CommandeModelsController.js';


const router = express.Router();

// Routes de l'utilisateur
router.route("/register").post((req, res) => UserController.create(req, res));
router.route("/login").post((req, res) => UserController.login(req, res));
router.route("/logout").post((req, res) => UserController.logout(req, res));
router.route("/test").get(auth, (req, res) => UserController.test(req, res));
router.route("/user/:id/updateMeasurements").put((req, res) => UserController.updateMeasurements(req, res));

// Routes pour suivre/désuivre des utilisateurs
router
  .route("/follow/:id")
  .post(auth,(req, res) => UserController.followUser(req, res));
router
  .route("/unfollow/:id")
  .post(auth,(req, res) => UserController.unfollowUser(req, res));
router
  .route("/add-note/:id")
  .post(auth, (req, res) => UserController.addNote(req, res));
router
  .route("/signal/:id")
  .post(auth, (req, res) => UserController.reportUser(req, res));



// Routes pour les modèles
router
  .route("/model/create")
  .post(auth, (req, res) => ModelController.create(req, res));
  // Routes pour afficher les modèles d'un utilisateur
router
  .route("/model/:userId/getModels")
  .get(auth, (req, res) => ModelController.getModelsByUserId(req, res));
router
  .route("/model/:modelId/update")
  .put(auth, (req, res) => ModelController.updateModel(req, res));
router
  .route("/model/:modelId/delete")
  .delete(auth, (req, res) => ModelController.deleteModel(req, res));
  router
  .route("/model/:modelId")
  .get(auth, (req, res) => ModelController.getModelById(req, res));
//routes pour noteModel
router
  .route("/model/:modelId/note")
  .post(auth, (req, res) => ModelController.noteModel(req, res));



router
  .route("/model/:modelId/unlike")
  .post(auth, (req, res) => ModelController.unlikeModel(req, res));


  
  

// Routes pour les posts
router
  .route("/post/create")
  .post(auth, (req, res) => PostController.create(req, res));
router
  .route("/post")
  .get(auth, (req, res) => PostController.getAllPosts(req, res));
router
  .route("/post/:id")
  .get(auth, (req, res) => PostController.getPostById(req, res));
router
  .route("/post/:id/model")
  .get(auth, (req, res) => PostController.getModel(req, res));
router
  .route("/post/favorite/create/:id")
  .post(auth, (req, res) => PostController.addFavorite(req, res));

// Routes pour les histoires

router.route('/story/create').post(auth, StoryController.createStory);
router.route('/stories/:userId').get(auth, (req, res) => StoryController.getStories(req, res));
// Route pour supprimer une story
router.route('/story/:id/delete').delete(auth, (req, res) => StoryController.deleteStory(req, res));
router.route('/story/:id/view').post(auth, (req, res) => StoryController.viewStory(req, res)); // Incrémenter les vues
router.route('/story/:id/views').get(auth, (req, res) => StoryController.getStoryViews(req, res)); // Obtenir le nombre de vues


// Routes pour les likes
router.post("/post/:postId/like", auth, likePost);
router.post("/post/:postId/like/:likeID/unlike", auth, unlikePost);
router.get("/post/:postId/likes", auth, getPostLikes);

// Routes pour les dislikes
router.post("/post/:postId/Dislike", auth, dislikePost);
router.post("/post/:postId/dislike/:dislikeID/undislike", auth, undislikePost);
router.get("/post/:postId/Dislike", auth, getPostDislike);

router
  .route("/post/favorite/:id")
  .post(auth, (req, res) => PostController.getAllFavorites(req, res));

// Route pour supprimer un favori
router
  .route("/post/favorite/remove/:id")
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

router
  .route("/post/:id")
  .delete(auth, (req, res) => PostController.deletePost(req, res));

router
  .route("/post/:postId/share")
  .post(auth, (req, res) => PostController.partagerPost(req, res));

router.route("/test").get(auth, (req, res) => UserController.test(req, res));

// Route pour aimer un post
/* router.post('/post/:postId/like', likePost); */
router.post("/post/:postId/like", auth, likePost);

// Route pour ne pas aimer un post
router.post("/post/:postId/like/:likeID/unlike", auth, unlikePost);

// Route pour récupérer les likes d'un post
router.get("/post/:postId/likes", auth, getPostLikes);

// Route pour disliker un post
router.post("/post/:postId/Dislike", auth, dislikePost);

// Route pour retirer un dislike
router.post("/post/:postId/dislike/:dislikeID/undislike", auth, undislikePost);
// Route pour afficher les dislikes
router.get("/post/:postId/Dislike", auth, getPostDislike);

// Routes pour les commentaires

router.post('/post/:postId/comment', auth, addComment);
router.delete('/comment/:commentId', auth, deleteComment);
router.get('/post/:postId/comments', auth, getPostComments);

// Routes pour les roles de utilisateurs
router.post('/user/changeRole',auth, UserController.changeRole);
// Routes pour bloquer un user
router.post('/user/:userID/bloquer',auth, UserController.bloquerUsers);
router.post('/user/:userID/debloquer',auth, UserController.debloquerUsers);
router.get('/user/bloquer',auth, UserController.getUserBloquer);
router.post('/post/:postId',auth, PostController.marquerVue);
router.get('/post/:postId/vues',auth, PostController.getVues);
router.delete('/user/discussion/:discussionId/messages/:messageId',auth, UserController.deleteMessage);
router.put('/user/discussion/:discussionId/messages/:messageId',auth, UserController.modifierMessages);

// Routes pour les commades
router.post('/post/:postId/commande', auth,createCommande);
router.get('/post/:postId/commandes', auth,getCommandesByPostId);
router.get('/commande/:commandeId', auth, getCommandeById);
router.post('/story/:storyId/commande', auth,createCommande);


// ROUTE POUR RECHARGER CRÉDIT TAILLEUR:
router
  .route("/chargeCredit")
  .post(auth, (req, res) => UserController.chargeCredit(req, res));


router
  .route("/updateNote/:id")
  .post(auth, (req, res) => UserController.updateNote(req, res));

router
  .route("/wishList/:id")
  .post(auth, (req, res) => UserController.listeSouhaits(req, res));

router.get('/notifications', auth, PostController.getNotifications);

router.delete('/notifications/:notificationId', auth, PostController.deleteNotification);

router.post('/acheter-badge', auth, UserController.acheterBadge);


router.get('/tailleurs', auth, UserController.getTailleurs);
router.get('/tailleurs/filter/:tailleurId', auth, UserController.filterTailleurById);
router.get('/tailleurs/name/:name', auth, UserController.filterByName);
router.get('/tailleurs/filterNote', auth, UserController.filterByNotes);
router.get('/tailleurs/filterCertificat', auth, UserController.filterTailleurByCertificat);
router.get('/tailleurs/statistique', auth, UserController.getStatistiques);


export default router;
 