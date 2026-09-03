import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import recipeRoutes from "./recipe.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import mealPlanRoutes from "./mealPlan.routes.js";
import fridgeRoutes from "./fridge.routes.js";
import cookingAssistantRoutes from "./cookingAssistant.routes.js";
import friendsRoutes from "./friends.routes.js";
import feedRoutes from "./feed.routes.js";
import userDataRoutes from "./user-data.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/recipes", recipeRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/meal-plans", mealPlanRoutes);
router.use("/fridge", fridgeRoutes);
router.use("/cooking-assistant", cookingAssistantRoutes);
router.use("/friends", friendsRoutes);
router.use("/feed", feedRoutes);
router.use("/user-data", userDataRoutes);

export default router;
