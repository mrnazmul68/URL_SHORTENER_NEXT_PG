import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { urlRoute } from "./modules/urlShortener/url.routes.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import { authRoutes } from "@modules/auth/auth.routes.js";
import { env } from "@config/env.js";
import cookieParser from "cookie-parser";

dotenv.config();

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/", urlRoute);

app.use(globalErrorHandler);
