import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@utils/jwt.js";
import { ApiError } from "@utils/apiError.js";
import { findById } from "@modules/user/user.repository.js";
import type { User } from "../../generated/prisma/client.js";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "name" | "email">;
    }
  }
}

export {};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }
  const decoded = verifyAccessToken(token);
  const user = await findById(decoded.userId);
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }
  req.user = user;
  next();
};
