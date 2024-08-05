import express from "express";
// import db from "../database/data.js";
// import authMiddleware from '../middlewares/auth.js';
// import auth from "../middlewares/auth.js";
import UserController from "../controllers/UserController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post((req, res) => UserController.create(req, res));

router.route("/login").post((req, res) => UserController.login(req, res));

router.route("/logout").post((req, res) => UserController.logout(req, res));

router.route("/test").get(auth, (req, res) => UserController.test(req, res));

router; 


// FOLLOW USER
router
  .route("/follow/:id")
  .post((req, res) => UserController.followUser(req, res));

// UNFOLLOW USER:
router
  .route("/unfollow/:id")
  .post((req, res) => UserController.unfollowUser(req, res));


export default router;
