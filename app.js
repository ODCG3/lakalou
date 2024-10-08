import express from "express";
import PrismaRouter from "./routes/PrismaRouter.js";
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import cors from 'cors';
import Connexion from "./config/Connexion.js";
import likeRoutes from './routes/Routes.js';
const app = new express();
app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}));
// Connexion.connect();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(PrismaRouter)
app.use('/api/likes', likeRoutes);
app.listen(3004, () => console.log("running on port 3004"));


export default app;