import { ApiError } from "@utils/apiError.js";
import * as authRepository from "@modules/user/user.repository.js";
import bcrypt from "bcryptjs";
import { userReturn } from "@utils/userReturn.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@utils/jwt.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

//todo: register user
export const registerUser = async (userData: RegisterInput) => {
  const { name, email, password } = userData;
  if (!email || !name || !password) {
    throw new ApiError(400, "All fields are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 charecters");
  }
  const existUser = await authRepository.findByEmail(email);
  if (existUser) {
    throw new ApiError(400, "User already exist");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const create = await authRepository.registerUser({
    name,
    email,
    password: hashedPassword,
  });
  const accessToken = generateAccessToken(create.id);
  const refreshToken = generateRefreshToken(create.id);
  return { create: userReturn(create), accessToken, refreshToken };
};

//todo: login user
export const loginUser = async (userData: LoginInput) => {
  const { email, password } = userData;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await authRepository.findByEmail(email);
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  return { user: userReturn(user), accessToken, refreshToken };
};

//todo: refresh access token
export const refreshAccessToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  const user = await authRepository.findById(decoded.userId);
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  const accessToken = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);
  return { accessToken, newRefreshToken };
};
