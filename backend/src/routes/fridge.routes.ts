import { Router } from "express";
import { fridgeController } from "../controllers/fridge.controller.js";

const router = Router();

router.post("/analyze", (req, res, next) => fridgeController.analyzeImage(req, res, next));
router.post("/suggest", (req, res, next) => fridgeController.suggestMeals(req, res, next));

export default router;
