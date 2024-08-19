import express from "express";
import PrismaRouter from "./routes/PrismaRouter.js";
import cookieParser from 'cookie-parser';
import 'dotenv/config';
// import Connexion from "./config/Connexion.js";
import likeRoutes from './routes/Routes.js';
const app = new express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//Connexion.connect();
app.use(PrismaRouter)
// Ajouter les routes pour les likes
app.use('/api/likes', likeRoutes);
app.listen(3004, () => console.log("running on port 3004"));


export default app;