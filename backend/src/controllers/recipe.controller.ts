import type { Request, Response, NextFunction } from "express";
import { recipeService } from "../services/recipe.service.js";

export class RecipeController {
  async getAuthenticRecipes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, category, limit } = req.query;
      const parsedLimit = limit ? parseInt(String(limit), 10) : 12;

      const recipes = await recipeService.getAuthenticRecipes(
        typeof search === "string" ? search : undefined,
        typeof category === "string" ? category : undefined,
        parsedLimit
      );

      res.status(200).json({
        success: true,
        count: recipes.length,
        data: recipes,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllRecipes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, difficulty } = req.query;
      const recipes = await recipeService.getAllRecipes(
        typeof search === "string" ? search : undefined,
        typeof difficulty === "string" ? difficulty : undefined
      );
      res.status(200).json({ success: true, data: recipes });
    } catch (error) {
      next(error);
    }
  }

  async getRecipeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        res.status(400).json({ success: false, message: "Valid Recipe ID is required" });
        return;
      }
      const recipe = await recipeService.getRecipeDetails(id);
      if (!recipe) {
        res.status(404).json({ success: false, message: "Recipe not found" });
        return;
      }
      res.status(200).json({ success: true, data: recipe });
    } catch (error) {
      next(error);
    }
  }

  async createRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recipe = await recipeService.createRecipe(req.body);
      res.status(201).json({ success: true, data: recipe });
    } catch (error) {
      next(error);
    }
  }

  async updateRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        res.status(400).json({ success: false, message: "Valid Recipe ID is required" });
        return;
      }
      const recipe = await recipeService.updateRecipe(id, req.body);
      res.status(200).json({ success: true, data: recipe });
    } catch (error) {
      next(error);
    }
  }

  async deleteRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        res.status(400).json({ success: false, message: "Valid Recipe ID is required" });
        return;
      }
      await recipeService.deleteRecipe(id);
      res.status(200).json({ success: true, message: "Recipe deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const recipeController = new RecipeController();
