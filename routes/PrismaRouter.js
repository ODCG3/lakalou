import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.js";
import PrismaUserController from "../dist/PrismaUserController.js";
import ModelController from "../dist/ModelController.js";

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

  router.get('/signale/:userId', auth, PrismaUserController.reportUser);

  router
  .route('/followUser')
  .post(auth, (req, res) => PrismaUserController.followUser(req, res));

  router
  .route('/unfollowUser')
  .post(auth, (req, res) => PrismaUserController.unfollowUser(req, res));


  router
  .route('/profile/:userID')
  .get(auth, (req, res) => PrismaUserController.profile(req, res));

  router
  .route('/changeRole')
  .post(auth, (req, res) => PrismaUserController.changeRole(req, res));

  router
  .route('/bloquerUsers')
  .post(auth, (req, res) => PrismaUserController.bloquerUsers(req, res));
  

export default router;
