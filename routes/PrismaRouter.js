import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.js";
import PrismaUserController from "../dist/PrismaUserController.js";
import ModelController from "../dist/ModelController.js";
import StoryController from "../dist/StoryController.js";

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

router.route('/story/create').post(auth, StoryController.createStory);
router.route('/stories/:userId').get(auth, (req, res) => StoryController.getStories(req, res));
// Route pour supprimer une story
router.route('/story/:id/delete').delete(auth, (req, res) => StoryController.deleteStory(req, res));
router.route('/story/:id/view').post(auth, (req, res) => StoryController.viewStory(req, res)); // Incrémenter les vues
router.route('/story/:id/views').get(auth, (req, res) => StoryController.getStoryViews(req, res)); // Obtenir le nombre de vues

export default router;
