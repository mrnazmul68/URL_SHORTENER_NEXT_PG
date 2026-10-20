import { env } from "@config/env.js";
import jwt from "jsonwebtoken";
import { ApiError } from "./apiError.js";

//todo: generate access token
export const generateAccessToken = (userId: string): string =>
  jwt.sign({ userId }, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

//todo: generate refresh token
export const generateRefreshToken = (userId: string): string =>
  jwt.sign({ userId }, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

//todo: verify access token
export const verifyAccessToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET) as { userId: string };
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
};

//todo: verify refresh token
export const verifyRefreshToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET) as {
      userId: string;
    };
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
};
