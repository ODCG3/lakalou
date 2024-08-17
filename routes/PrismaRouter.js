import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.js";
import PrismaUserController from "../dist/PrismaUserController.js";
import ModelController from "../dist/ModelController.js";
import PostController from "../dist/PostController.js";
import CommandeModelController from "../dist/CommandeModelController.js"

router.route("/register").post((req, res) => PrismaUserController.create(req, res));
router.route("/login").post((req, res) => PrismaUserController.login(req, res));
router.route("/logout").post(auth,(req, res) => PrismaUserController.logout(req, res));
 router.route("/Notes/:id").post(auth,(req, res) => PrismaUserController.addNotes(req, res));

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


export default router;
