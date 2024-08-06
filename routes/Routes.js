import express from "express";
import UserController from "../controllers/UserController.js";
import auth from "../middlewares/auth.js";
import ModelController from "../controllers/ModelController.js";
import PostController from "../controllers/PostController.js";
import StoryController from '../controllers/StoryController.js';

const router = express.Router();

// User routes
router.route('/register')
    .post(UserController.create);

router.route('/login')
    .post(UserController.login);

router.route('/logout')
    .post(UserController.logout);

// Model routes
router.route('/model/create')
    .post(auth, ModelController.create);

// Post routes
router.route('/post/create')
    .post(auth, PostController.create);

// Story routes
router.route('/story/create')
    .post(auth, StoryController.createStory);

// Test route
router.route('/test')
    .get(auth, UserController.test);

export default router;
