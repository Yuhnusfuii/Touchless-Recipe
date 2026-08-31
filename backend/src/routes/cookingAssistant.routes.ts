import { Router } from "express";
import { answerCookingQuestion } from "../controllers/cookingAssistant.controller.js";

const router = Router();
router.post("/chat", answerCookingQuestion);

export default router;