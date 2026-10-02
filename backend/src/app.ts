import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { urlRoute } from "./modules/urlShortener/url.routes.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
dotenv.config();

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/", urlRoute);

app.use(globalErrorHandler)