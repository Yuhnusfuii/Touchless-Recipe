import type { Request, Response, NextFunction } from "express";
import { fridgeService } from "../services/fridge.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export class FridgeController {
  async analyzeImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { image, mimeType, language = "vi" } = req.body as {
        image?: unknown;
        mimeType?: unknown;
        language?: unknown;
      };

      if (typeof image !== "string" || !image.trim()) {
        res.status(400).json({ success: false, message: "Image data is required" });
        return;
      }
      if (image.length > 12_000_000) {
        res.status(413).json({ success: false, message: "Image is too large" });
        return;
      }
      if (typeof mimeType !== "string" || !/^image\/(jpeg|png|webp|gif)$/i.test(mimeType)) {
        res.status(400).json({ success: false, message: "Unsupported image type" });
        return;
      }
      if (language !== "en" && language !== "vi") {
        res.status(400).json({ success: false, message: "Unsupported language" });
        return;
      }

      const items = await fridgeService.analyzeImage(image, mimeType, language);
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  }

  async suggestMeals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { items, language = "vi", filters, sessionId } = req.body as { items?: unknown; language?: unknown; filters?: unknown; sessionId?: unknown };
      if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
        res.status(400).json({ success: false, message: "At least one ingredient is required" });
        return;
      }
      if (language !== "en" && language !== "vi") {
        res.status(400).json({ success: false, message: "Unsupported language" });
        return;
      }
      if (typeof sessionId !== "string" || !sessionId.trim() || sessionId.length > 100) {
        res.status(400).json({ success: false, message: "A valid session id is required" });
        return;
      }
      const submittedFilters = filters && typeof filters === "object" ? filters as Record<string, unknown> : {};
      const mealType = submittedFilters.mealType;
      if (mealType !== "vegetarian" && mealType !== "savory" && mealType !== "sweet" && mealType !== "none") {
        res.status(400).json({ success: false, message: "Invalid meal type filter" });
        return;
      }
      const allergies = Array.isArray(submittedFilters.allergies)
        ? submittedFilters.allergies.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 20)
        : [];

      const validItems = items.filter((item): item is { name: string; category: string; quantity: string } =>
        Boolean(item) && typeof item === "object" && typeof item.name === "string" && item.name.trim().length > 0
      );
      const suggestions = await fridgeService.suggestMeals(validItems, language, {
        mealType,
        highProtein: submittedFilters.highProtein === true,
        allergies,
      }, sessionId.trim(), (req as AuthRequest).user?.id);
      res.status(200).json({ success: true, data: suggestions });
    } catch (error) {
      next(error);
    }
  }
}

export const fridgeController = new FridgeController();
