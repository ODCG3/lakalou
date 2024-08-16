import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.js";
import PrismaUserController from "../dist/PrismaUserController.js";

router.route("/register").post((req, res) => PrismaUserController.create(req, res));
router.route("/login").post((req, res) => PrismaUserController.login(req, res));
router.route("/logout").post(auth,(req, res) => PrismaUserController.logout(req, res));
 router.route("/Notes/:id").post(auth,(req, res) => PrismaUserController.addNotes(req, res));

export default router;
