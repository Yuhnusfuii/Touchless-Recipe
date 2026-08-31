import { Router } from "express";
import { mealPlanController } from "../controllers/mealPlan.controller.js";

const router = Router();

router.get("/user/:userId", (req, res, next) =>
  mealPlanController.getMealPlansByUser(req, res, next)
);
router.get("/generated/user/:userId", (req, res, next) =>
  mealPlanController.getGeneratedMealPlansByUser(req, res, next)
);
router.post("/generate", (req, res, next) => mealPlanController.generateMealPlan(req, res, next));
router.post("/generated", (req, res, next) => mealPlanController.saveGeneratedMealPlan(req, res, next));
router.delete("/generated/:id", (req, res, next) =>
  mealPlanController.deleteGeneratedMealPlan(req, res, next)
);
router.post("/", (req, res, next) =>
  mealPlanController.createMealPlan(req, res, next)
);
router.delete("/:id", (req, res, next) =>
  mealPlanController.deleteMealPlan(req, res, next)
);

export default router;
