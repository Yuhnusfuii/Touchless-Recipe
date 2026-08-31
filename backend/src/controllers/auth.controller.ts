import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { userService } from "../services/user.service.js";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, confirmPassword } = req.body;

      const result = await authService.register({
        name,
        email,
        password,
        confirmPassword,
      });

      res.status(201).json({
        success: true,
        message: "Account registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async loginOrRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, name, image, dietaryPrefs, kcalTarget } = req.body;
      if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
      }

      const result = await authService.loginOrRegister({
        email,
        name: name || "Chef",
        image,
        dietaryPrefs,
        kcalTarget,
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Not authorized" });
        return;
      }
      const user = await userService.getUserById(req.user.id);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
