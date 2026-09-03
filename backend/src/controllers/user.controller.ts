import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service.js";

export class UserController {
  async getAllUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        res.status(400).json({ success: false, message: "Valid User ID is required" });
        return;
      }
      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        res.status(400).json({ success: false, message: "Valid User ID is required" });
        return;
      }
      const user = await userService.updateUser(id, req.body);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async recordCookingProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        res.status(400).json({ success: false, message: "Valid User ID is required" });
        return;
      }

      const { recipeId, currentStepIndex, totalSteps, isHandsFree } = req.body;
      if (!recipeId || totalSteps === undefined) {
        res.status(400).json({
          success: false,
          message: "recipeId and totalSteps are required",
        });
        return;
      }

      const result = await userService.recordCookingProgress(id, {
        recipeId: String(recipeId),
        currentStepIndex: Number(currentStepIndex || 0),
        totalSteps: Number(totalSteps),
        isHandsFree: Boolean(isHandsFree),
      });

      res.status(200).json({
        success: true,
        message: "Cooking progress recorded successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        res.status(400).json({ success: false, message: "Valid User ID is required" });
        return;
      }
      await userService.deleteUser(id);
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
