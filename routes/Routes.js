import express from "express";
import UserController from "../controllers/UserController.js";
import auth from "../middlewares/auth.js";
import ModelController from "../controllers/ModelController.js";
import PostController from "../controllers/PostController.js";
import StoryController from '../controllers/StoryController.js';

const router = express.Router();

router.route("/register").post((req, res) => UserController.create(req, res));

router.route("/login").post((req, res) => UserController.login(req, res));

router.route("/logout").post((req, res) => UserController.logout(req, res));

router.route("/test").get(auth, (req, res) => UserController.test(req, res));

// FOLLOW USER

router
  .route("/follow/:id")
  .post((req, res) => UserController.followUser(req, res));

// UNFOLLOW USER:
router
  .route("/unfollow/:id")
  .post((req, res) => UserController.unfollowUser(req, res));

router.route('/add-note/:id')
    .post(auth, (req, res) => UserController.addNote(req, res));

router.route('/signal/:id')
    .post(auth, (req, res) => UserController.reportUser(req, res));

// Model routes
router.route('/model/create')
    .post(auth, (req, res) => ModelController.create(req, res));

// Post routes
router.route('/post/create')
    .post(auth, (req, res) => PostController.create(req, res));

router.route('/post')
    .get(auth, (req, res) => PostController.getAllPosts(req, res));

router.route('/post/:id')
    .get(auth, (req, res) => PostController.getPostById(req, res));

router.route('/post/:id/model')
    .get(auth, (req, res) => PostController.getModel(req, res));

// Story routes
router.route('/story/create')
    .post(auth, StoryController.createStory);


router.route('/profile')
    .get(auth, (req, res) => UserController.profile(req, res));

export default router;
