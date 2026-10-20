import type { Request, Response } from "express";
import * as authService from "@modules/auth/auth.service.js";
import { ApiResponse } from "@utils/apiResponse.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

//todo: register user
export const register = async (
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
) => {
  const data = req.body;
  const { create, accessToken, refreshToken } =
    await authService.registerUser(data);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return new ApiResponse(
    200,
    { create, accessToken },
    "User registered successfully",
  ).send(res);
};

//todo: login user
export const login = async (
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
) => {
  const data = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(data);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return new ApiResponse(
    200,
    { user, accessToken },
    "User logged in successfully",
  ).send(res);
};

//todo: redirect to refresh token route
export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return new ApiResponse(401, null, "Unauthorized").send(res);
  }

  const { accessToken, newRefreshToken } =
    await authService.refreshAccessToken(refreshToken);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return new ApiResponse(200, { accessToken }, "Access token refreshed").send(
    res,
  );
};

//todo: logout user
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return new ApiResponse(200, null, "User logged out successfully").send(res);
};

//todo: get me profile
export const me = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return new ApiResponse(401, null, "Unauthorized").send(res);
  }

  return new ApiResponse(200, user, "Profile retrieved successfully").send(res);
};
