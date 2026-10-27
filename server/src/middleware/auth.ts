// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase.js";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const verifyAuthToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ status: "error", message: "Token autentikasi tidak ditemukan" });
    return;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    console.error("[AUTH MIDDLEWARE] Token tidak valid:", error);
    res.status(401).json({ status: "error", message: "Token tidak valid atau telah kedaluwarsa" });
  }
};