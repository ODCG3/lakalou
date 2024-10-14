import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.js";
import PrismaUserController from "../dist/PrismaUserController.js";
import ModelController from "../dist/ModelController.js";
import PostController from "../dist/PostController.js";
import CommandeModelController from "../dist/CommandeModelController.js";
import MessagesDiscussionController from "../dist/MessagesDiscussionController.js";
import ListeSouhaitsController from "../dist/ListeSouhaitsController.js";
import StoryController from "../dist/StoryController.js";
import ArticleController from "../dist/ArticleController.js";
import PostArticleController from "../dist/PostArticleController.js";
import CommentController from "../dist/CommentController.js";

router
  .route("/register")
  .post((req, res) => PrismaUserController.create(req, res));
router.route("/login").post((req, res) => PrismaUserController.login(req, res));

router
  .route("/logout")
  .post(auth, (req, res) => PrismaUserController.logout(req, res));

router
  .route("/notes/:id")
  .post(auth, (req, res) => PrismaUserController.addNotes(req, res));

router
  .route("/Notes/:id/:noteId")
  .put(auth, (req, res) => PrismaUserController.updateNote(req, res));

router
  .route("/GetNotes/")
  .get(auth, (req, res) => PrismaUserController.getNotes(req, res));

router
  .route("/posts/:postId/notes")
  .get(auth, (req, res) => PrismaUserController.getUserNotesFromPost(req, res));

router
  .route("/tailleur/:tailleurId")
  .get(auth, (req, res) => PrismaUserController.filterTailleurById(req, res));
router
  .route("/tailleur/name/:name")
  .get(auth, (req, res) => PrismaUserController.filterByName(req, res));

router
  .route("/filterByNotes/:id")
  .get(auth, (req, res) => PrismaUserController.filterByNotes(req, res));
router
  .route("/logout")
  .post(auth, (req, res) => PrismaUserController.logout(req, res));

router
  .route("/Notes/:id/:noteId")
  .put(auth, (req, res) => PrismaUserController.updateNote(req, res));

// ROUTE TAILLEURS:
router
  .route("/listeTailleurs")
  .get(auth, (req, res) => PrismaUserController.getTailleurs(req, res));

router
  .route("/myPosition")
  .get(auth, (req, res) => PrismaUserController.myPosition(req, res));

router
  .route("/rang")
  .get(auth, (req, res) => PrismaUserController.getTailleurRanking(req, res));

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

router
  .route("/model/:modelId/delete")
  .delete(auth, (req, res) => ModelController.deleteModel(req, res));

router
  .route("/model/:modelId")
  .get(auth, (req, res) => ModelController.getModelById(req, res));

router.route("/story/create").post(auth, StoryController.createStory);
router
  .route("/stories/:userId")
  .get(auth, (req, res) => StoryController.getStories(req, res));
// Route pour supprimer une story
router
  .route("/story/:id/delete")
  .delete(auth, (req, res) => StoryController.deleteStory(req, res));
router
  .route("/story/:id/view")
  .post(auth, (req, res) => StoryController.viewStory(req, res)); // Incrémenter les vues
router
  .route("/story/:id/views")
  .get(auth, (req, res) => StoryController.getStoryViews(req, res)); // Obtenir le nombre de vues

router
  .route("/post/create")
  .post(auth, (req, res) => PostController.createPost(req, res));

router
  .route("/post/:postId/comments/create")
  .post(auth, (req, res) => CommentController.addComment(req, res));
router
  .route("/comment/:commentId")
  .delete(auth, (req, res) => CommentController.deleteComment(req, res));
router
  .route("/post/:postId/comments")
  .get(auth, (req, res) => CommentController.getPostComments(req, res));

router
  .route("/post")
  .get(auth, (req, res) => PostController.getPosts(req, res));
router
  .route("/post/:postId")
  .get(auth, (req, res) => PostController.getPostById(req, res));
router
  .route("/post/:postId")
  .delete(auth, (req, res) => PostController.deletePost(req, res));
router
  .route("/post/:postId")
  .post(auth, (req, res) => PostController.addView(req, res));
router
  .route("/post/:postId")
  .get(auth, (req, res) => PostController.getVues(req, res));
router
  .route("/post/favorite/create/:postId")
  .post(auth, (req, res) => PostController.addFavoris(req, res));
router
  .route("/post/favorite/remove/:postId")
  .delete(auth, (req, res) => PostController.deleteFavoris(req, res));
//router.route("/post/favorite").get(auth, (req, res) => PostController.getAllFavoris(req, res));

router
  .route("/post/:postId/share")
  .post(auth, (req, res) => PostController.partagerPost(req, res));
router
  .route("/notifications")
  .get(auth, (req, res) => PostController.getNotifications(req, res));
router
  .route("/notifications/:notificationId")
  .delete(auth, (req, res) => PostController.deleteNotification(req, res));

router
  .route("/commande")
  .post(auth, (req, res) => CommandeModelController.createCommande(req, res));
router
  .route("/commandes/post/:postId")
  .post(auth, (req, res) => CommandeModelController.createCommande(req, res));
router
  .route("/commandes/story/:storyId")
  .post(auth, (req, res) => CommandeModelController.createCommande(req, res));
router
  .route("/commandes/post/:postId")
  .get(auth, (req, res) => CommandeModelController.getCommandes(req, res));
router
  .route("/commandes/story/:storyId")
  .get(auth, (req, res) => CommandeModelController.getCommandes(req, res));
router
  .route("/commandes/:commandeId")
  .get(auth, (req, res) => CommandeModelController.getCommandeById(req, res));

router
  .route("/user/discussions/create")
  .post(auth, (req, res) =>
    MessagesDiscussionController.createDiscussion(req, res)
  );
router
  .route("/user/discussions")
  .get(auth, (req, res) =>
    MessagesDiscussionController.getDiscussions(req, res)
  );
router
  .route("/user/discussions/:userId")
  .get(auth, (req, res) =>
    MessagesDiscussionController.getDiscussionsByUser(req, res)
  );
router
  .route("/user/discussions/:discussionUser/messages")
  .post(auth, (req, res) =>
    MessagesDiscussionController.sendMessageToDiscussion(req, res)
  );
router
  .route("/user/discussions/:discussionId/messages/:messageId")
  .delete(auth, (req, res) =>
    MessagesDiscussionController.deleteMessage(req, res)
  );
router
  .route("/user/discussions/:discussionId/messages/:messageId")
  .put(auth, (req, res) =>
    MessagesDiscussionController.modifierMessages(req, res)
  );
router
  .route("/user/chargeCredit")
  .post(auth, (req, res) => PrismaUserController.chargeCredit(req, res));
router
  .route("/user/modifierMesure")
  .put(auth, (req, res) => PrismaUserController.updateMeasurements(req, res));
router
  .route("/user/acheterBadge")
  .post(auth, (req, res) => PrismaUserController.acheterBadge(req, res));
router
  .route("/user/listeSouhaits/:id")
  .post(auth, (req, res) => ListeSouhaitsController.listeSouhaits(req, res));
router
  .route("/user/listeSouhaits")
  .get(auth, (req, res) => ListeSouhaitsController.voirListeSouhaits(req, res));

router
  .route("/souhaits/:id")
  .delete(auth, (req, res) =>
    ListeSouhaitsController.supprimerSouhait(req, res)
  );

router
  .route("/getConnectedUser")
  .get(auth, (req, res) => PrismaUserController.getConnectedUser());

router.get("/signale/:userId", auth, PrismaUserController.reportUser);

router
  .route("/followUser")
  .post(auth, (req, res) => PrismaUserController.followUser(req, res));

router
  .route("/unfollowUser")
  .post(auth, (req, res) => PrismaUserController.unfollowUser(req, res));

router
  .route("/profile/:userID")
  .get(auth, (req, res) => PrismaUserController.profile(req, res));

router
  .route("/changeRole")
  .post(auth, (req, res) => PrismaUserController.changeRole(req, res));

router
  .route("/bloquerUsers")
  .post(auth, (req, res) => PrismaUserController.bloquerUsers(req, res));

router
  .route("/debloquerUsers")
  .post(auth, (req, res) => PrismaUserController.debloquerUsers(req, res));
// routes pour afficher les utilisateurs bloquer
router
  .route("/getUserBloquer")
  .get(auth, (req, res) => PrismaUserController.getUserBloquer(req, res));

router
  .route("/myFollowers")
  .get(auth, (req, res) => PrismaUserController.myFollowers(req, res));

router
  .route("/tailleurs/statistique")
  .get(auth, (req, res) => PrismaUserController.getStatistiques(req, res));

router
  .route("/filterTailleurByCertificat")
  .get(auth, (req, res) =>
    PrismaUserController.filterTailleurByCertificat(req, res)
  );

router
  .route("/CreateArticle")
  .post(auth, (req, res) => ArticleController.createArticle(req, res));
router.post("/postArticle/:articleId", auth, (req, res) =>
  PostArticleController.createPostArticle(req, res)
);
router
  .route("/getArticles")
  .get(auth, (req, res) => ArticleController.getArticles(req, res));

router
  .route("/acheterBadgeVandeur/:id")
  .post(auth, (req, res) => PrismaUserController.acheterBadgeVandeur(req, res));

export default router;
