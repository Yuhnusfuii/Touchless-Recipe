import type { Request, Response, NextFunction } from "express";
import { mealPlanService } from "../services/mealPlan.service.js";

export class MealPlanController {
  async getMealPlansByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId || typeof userId !== "string") {
        res.status(400).json({ success: false, message: "Valid User ID is required" });
        return;
      }
      const plans = await mealPlanService.getMealPlansByUser(userId);
      res.status(200).json({ success: true, data: plans });
    } catch (error) {
      next(error);
    }
  }

  async generateMealPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as Record<string, unknown>;
      if (typeof body.startDate !== "string" || typeof body.endDate !== "string" || typeof body.period !== "string") {
        res.status(400).json({ success: false, message: "Dates and period are required" });
        return;
      }
      const plan = await mealPlanService.generateMealPlan({
        userId: typeof body.userId === "string" ? body.userId : undefined,
        startDate: body.startDate, endDate: body.endDate,
        period: body.period as "days" | "week" | "month",
        servings: typeof body.servings === "number" ? body.servings : 1,
        mealsPerDay: typeof body.mealsPerDay === "number" ? body.mealsPerDay : 3,
        mealsPerMeal: typeof body.mealsPerMeal === "number" ? body.mealsPerMeal : 1,
        mealTimes: Array.isArray(body.mealTimes) ? body.mealTimes.filter((item): item is "breakfast" | "lunch" | "dinner" => item === "breakfast" || item === "lunch" || item === "dinner") : ["lunch", "dinner"],
        dailyCalories: typeof body.dailyCalories === "number" ? body.dailyCalories : 2000,
        goal: typeof body.goal === "string" ? body.goal : "balanced",
        tastes: Array.isArray(body.tastes) ? body.tastes.filter((item): item is string => typeof item === "string") : [],
        budget: typeof body.budget === "number" ? body.budget : 0,
        availableIngredients: Array.isArray(body.availableIngredients) ? body.availableIngredients.filter((item): item is string => typeof item === "string") : [],
        language: body.language === "en" ? "en" : "vi",
      });
      res.status(201).json({ success: true, data: plan });
    } catch (error) { next(error); }
  }

  async saveGeneratedMealPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as Record<string, unknown>;
      if (!body.userId || typeof body.userId !== "string" || !Array.isArray(body.days)) {
        res.status(400).json({ success: false, message: "User ID and generated days are required" });
        return;
      }
      const plan = await mealPlanService.saveGeneratedMealPlan({
        userId: body.userId,
        startDate: String(body.startDate || ""),
        endDate: String(body.endDate || ""),
        period: body.period as "days" | "week" | "month",
        servings: Number(body.servings) || 1,
        mealsPerDay: Number(body.mealsPerDay) || 3,
        mealsPerMeal: Number(body.mealsPerMeal) || 1,
        mealTimes: Array.isArray(body.mealTimes) ? body.mealTimes.filter((item): item is "breakfast" | "lunch" | "dinner" => item === "breakfast" || item === "lunch" || item === "dinner") : ["lunch", "dinner"],
        dailyCalories: Number(body.dailyCalories) || 2000,
        goal: String(body.goal || "balanced"),
        tastes: Array.isArray(body.tastes) ? body.tastes.filter((item): item is string => typeof item === "string") : [],
        budget: Number(body.budget) || 0,
        availableIngredients: Array.isArray(body.availableIngredients) ? body.availableIngredients.filter((item): item is string => typeof item === "string") : [],
        days: body.days as never,
      });
      res.status(201).json({ success: true, data: plan });
    } catch (error) { next(error); }
  }

  async getGeneratedMealPlansByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId || typeof userId !== "string") {
        res.status(400).json({ success: false, message: "Valid User ID is required" });
        return;
      }
      const plans = await mealPlanService.getGeneratedMealPlansByUser(userId);
      res.status(200).json({ success: true, data: plans });
    } catch (error) { next(error); }
  }

  async deleteGeneratedMealPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = typeof req.body?.userId === "string" ? req.body.userId : undefined;
      if (!id || typeof id !== "string" || !userId) {
        res.status(400).json({ success: false, message: "Plan ID and user ID are required" });
        return;
      }
      const deleted = await mealPlanService.deleteGeneratedMealPlan(id, userId);
      if (!deleted) {
        res.status(404).json({ success: false, message: "Saved meal plan not found" });
        return;
      }
      res.status(200).json({ success: true, message: "Saved meal plan deleted" });
    } catch (error) { next(error); }
  }

  async createMealPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plan = await mealPlanService.createMealPlan(req.body);
      res.status(201).json({ success: true, data: plan });
    } catch (error) {
      next(error);
    }
  }

  async deleteMealPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        res.status(400).json({ success: false, message: "Valid Meal Plan ID is required" });
        return;
      }
      await mealPlanService.deleteMealPlan(id);
      res.status(200).json({ success: true, message: "Meal plan deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const mealPlanController = new MealPlanController();
