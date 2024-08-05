import express from "express";
import router from "./routes/Routes.js";
import cookieParser from 'cookie-parser';

const app = new express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router)

app.listen(3004)