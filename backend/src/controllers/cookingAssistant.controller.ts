import type { Request, Response, NextFunction } from "express";
import { cookingAssistantService, type CookingAssistantContext } from "../services/cookingAssistant.service.js";

export async function answerCookingQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { question, context } = req.body as { question?: unknown; context?: CookingAssistantContext };
    if (typeof question !== "string" || !question.trim() || !context || typeof context.recipeTitle !== "string") {
      res.status(400).json({ success: false, message: "A cooking question and recipe context are required" });
      return;
    }
    const answer = await cookingAssistantService.answer(question.trim().slice(0, 1000), context);
    res.status(200).json({ success: true, data: { answer } });
  } catch (error) {
    next(error);
  }
}