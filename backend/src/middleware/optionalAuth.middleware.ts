import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@utils/jwt.js";
import { findById } from "@modules/user/user.repository.js";

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // টোকেন নেই, গেস্ট হিসেবে রিকোয়েস্ট পাস করে দাও
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next();
    }

    const decoded = verifyAccessToken(token);
    const user = await findById(decoded.userId);
    if (user) {
      req.user = user; // ইউজার পাওয়া গেলে req.user এ বসাও
    }
  } catch {
    // টোকেন এক্সপায়ার্ড বা ইনভ্যালিড হলেও আটকে রেখো না, গেস্ট হিসেবে যেতে দাও
  }

  next();
};
