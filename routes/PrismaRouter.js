import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.js";
import PrismaUserController from "../dist/PrismaUserController.js";
import ModelController from "../dist/ModelController.js";
import PostController from "../dist/PostController.js";
import CommandeModelController from "../dist/CommandeModelController.js"
import MessagesDiscussionController from "../dist/MessagesDiscussionController.js"
import StoryController from "../dist/StoryController.js";
import {addComment, deleteComment,getPostComments} from '../dist/CommentController.js';
 
router.route("/register").post((req, res) => PrismaUserController.create(req, res));
router.route("/login").post((req, res) => PrismaUserController.login(req, res));

router.route("/logout").post(auth,(req, res) => PrismaUserController.logout(req, res));
router.route("/Notes/:id").post(auth,(req, res) => PrismaUserController.addNotes(req, res));
router.route("/Notes/:id/:noteId").put(auth, (req, res) => PrismaUserController.updateNote(req, res));



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

router.route('/story/create').post(auth, StoryController.createStory);
router.route('/stories/:userId').get(auth, (req, res) => StoryController.getStories(req, res));
// Route pour supprimer une story
router.route('/story/:id/delete').delete(auth, (req, res) => StoryController.deleteStory(req, res));
router.route('/story/:id/view').post(auth, (req, res) => StoryController.viewStory(req, res)); // Incrémenter les vues
router.route('/story/:id/views').get(auth, (req, res) => StoryController.getStoryViews(req, res)); // Obtenir le nombre de vues

router.route("/post/create").post(auth,(req, res) => PostController.createPost(req, res));
router.route("/post").get(auth,(req, res) => PostController.getPosts(req, res));
router.route("/post/:postId").get(auth,(req, res) => PostController.getPostById(req, res));
router.route("/post/:postId").delete(auth,(req, res) => PostController.deletePost(req, res));
router.route("/post/:postId").post(auth,(req, res) => PostController.addView(req, res));
router.route("/post/:postId").get(auth,(req, res) => PostController.getVues(req, res));
router.route("/post/favorite/create/:postId").post(auth, (req, res) => PostController.addFavoris(req, res));
router.route("/post/favorite/remove/:postId").delete(auth,(req, res) => PostController.deleteFavoris(req, res));
//router.route("/post/favorite").get(auth, (req, res) => PostController.getAllFavoris(req, res));
router.route("/post/:postId/share").post(auth, (req, res) => PostController.partagerPost(req, res));

router.route('/commandes/post/:postId').post(auth, (req, res) => CommandeModelController.createCommande(req, res));
router.route('/commandes/story/:storyId').post(auth, (req, res) => CommandeModelController.createCommande(req, res));
router.route('/commandes/post/:postId').get(auth, (req, res) => CommandeModelController.getCommandes(req, res));
router.route('/commandes/story/:storyId').get(auth, (req, res) => CommandeModelController.getCommandes(req, res));
router.route('/commandes/:commandeId').get(auth, (req, res) => CommandeModelController.getCommandeById(req, res));

router.route('/user/discussions/create').post(auth, (req, res) => MessagesDiscussionController.createDiscussion(req, res));
router.route('/user/discussions').get(auth, (req, res) => MessagesDiscussionController.getDiscussions(req, res));
router.route('/user/discussions/:userId').get(auth, (req, res) => MessagesDiscussionController.getDiscussionsByUser(req, res));
router.route('/user/discussions/:discussionUser/messages').post(auth, (req, res) => MessagesDiscussionController.sendMessageToDiscussion(req, res));
router.route('/user/discussions/:discussionId/messages/:messageId').delete(auth, (req, res) => MessagesDiscussionController.deleteMessage(req, res));
router.route('/user/discussions/:discussionId/messages/:messageId').put(auth, (req, res) => MessagesDiscussionController.modifierMessages(req, res));
router.route('/user/chargeCredit').post(auth, (req, res) => PrismaUserController.chargeCredit(req, res));
router.post('/post/:postId/comment', auth, addComment);
router.delete('/comment/:commentId', auth, deleteComment);
router.get('/post/:postId/comments', auth, getPostComments);
router.get('/tailleurs/statistique', auth, PrismaUserController.getStatistiques);






export default router;
