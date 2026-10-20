import { Router } from "express";
import {
  login,
  logout,
  me,
  refreshToken,
  register,
} from "@modules/auth/auth.controller.js";
import { protect } from "../../middleware/protect.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { loginSchema, registerSchema } from "@modules/auth/auth.schema.js";

export const authRoutes = Router();

authRoutes.post("/register", validate({ body: registerSchema }), register);
authRoutes.post("/login", validate({ body: loginSchema }), login);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.post("/logout", protect, logout);
authRoutes.get("/me", protect, me);
