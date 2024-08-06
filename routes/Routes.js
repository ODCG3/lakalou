import express from "express";
// import db from "../database/data.js";
// import authMiddleware from '../middlewares/auth.js';
// import auth from "../middlewares/auth.js";
import UserController from "../controllers/UserController.js";
import auth from "../middlewares/auth.js";
import ModelController from "../controllers/ModelController.js";
import PostController from "../controllers/PostController.js";

import { likePost, unlikePost, getPostLikes } from '../controllers/LikeController.js';



const router = express.Router();





router.route('/register')
    .post((req, res) => UserController.create(req, res));

router.route('/login')
    .post((req, res) => UserController.login(req, res));

router.route('/logout')
    .post((req, res) => UserController.logout(req, res));

router.route('/model/create')
    .post(auth,(req, res) => ModelController.create(req, res));

router.route('/post/create')
    .post(auth,(req, res) => PostController.create(req, res));


router.route('/test')
    .get(auth, (req, res) => UserController.test(req, res));

// Route pour aimer un post
router.post('/post/:postId/like', likePost);

// Route pour ne pas aimer un post
router.delete('/post/:postId/unlike', unlikePost);

// Route pour récupérer les likes d'un post
router.get('/post/:postId/likes', getPostLikes);

export default router; 