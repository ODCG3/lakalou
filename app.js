import express from "express";
import router from "./routes/Routes.js";
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import Connexion from "./config/Connexion.js";

const app = new express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
Connexion.connect();
app.use(router)

app.listen(3004)