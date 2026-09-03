import { Router } from "express";
import { recipeController } from "../controllers/recipe.controller.js";

const router = Router();

// Authentic and curated recipes endpoint (TheMealDB + Database)
router.get("/authentic", (req, res, next) =>
  recipeController.getAuthenticRecipes(req, res, next)
);

// Standard CRUD endpoints
router.get("/", (req, res, next) => recipeController.getAuthenticRecipes(req, res, next));
router.get("/community", (req, res, next) => recipeController.getAllRecipes(req, res, next));
router.get("/:id", (req, res, next) => recipeController.getRecipeById(req, res, next));
router.post("/", (req, res, next) => recipeController.createRecipe(req, res, next));
router.put("/:id", (req, res, next) => recipeController.updateRecipe(req, res, next));
router.delete("/:id", (req, res, next) => recipeController.deleteRecipe(req, res, next));

export default router;
