import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
      return;
    }

    const secret = process.env["JWT_SECRET"] || "default_jwt_secret";
    const decoded = jwt.verify(token, secret) as { id: string; email: string };

    req.user = decoded;
    next();
  } catch (_error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, invalid or expired token",
    });
  }
};
