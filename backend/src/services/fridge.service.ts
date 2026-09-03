import { jsonrepair } from "jsonrepair";
import { MealSuggestionHistory } from "../models/mealSuggestion.model.js";

type FridgeDetection = {
  name: string;
  category: string;
  quantity: string;
};

export type MealSuggestion = {
  name: string;
  description: string;
  availableIngredients: string[];
  missingIngredients: string[];
  instructions: string[];
};

export type MealFilters = {
  mealType: "vegetarian" | "savory" | "sweet" | "none";
  highProtein: boolean;
  allergies: string[];
};

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

const GEMINI_MODEL = process.env["GEMINI_MODEL"] || "gemini-3.5-flash-lite";

function parseJsonResponse(text: string): Record<string, unknown> {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  const jsonText = (start >= 0 && end > start ? text.slice(start, end + 1) : text)
    .replace(/,\s*([}\]])/g, "$1");
  return JSON.parse(jsonrepair(jsonText)) as Record<string, unknown>;
}

function parseDetections(text: string): FridgeDetection[] {
  const parsed = parseJsonResponse(text) as { items?: unknown };
  if (!Array.isArray(parsed.items)) return [];

  return parsed.items
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({
      name: typeof item.name === "string" ? item.name.trim() : "",
      category: typeof item.category === "string" ? item.category.trim() : "Other",
      quantity: typeof item.quantity === "string" ? item.quantity.trim() : "Unknown",
    }))
    .filter((item) => item.name.length > 0)
    .slice(0, 50);
}

function parseSuggestions(text: string): MealSuggestion[] {
  const parsed = parseJsonResponse(text) as { recipes?: unknown };
  if (!Array.isArray(parsed.recipes)) return [];

  return parsed.recipes
    .filter((recipe): recipe is Record<string, unknown> => Boolean(recipe) && typeof recipe === "object")
    .map((recipe) => ({
      name: typeof recipe.name === "string" ? recipe.name.trim() : "",
      description: typeof recipe.description === "string" ? recipe.description.trim() : "",
      availableIngredients: Array.isArray(recipe.availableIngredients) ? recipe.availableIngredients.filter((item): item is string => typeof item === "string") : [],
      missingIngredients: Array.isArray(recipe.missingIngredients) ? recipe.missingIngredients.filter((item): item is string => typeof item === "string") : [],
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions.filter((item): item is string => typeof item === "string") : [],
    }))
    .filter((recipe) => recipe.name.length > 0)
    .slice(0, 6);
}

export const fridgeService = {
  async analyzeImage(image: string, mimeType: string, language: "en" | "vi"): Promise<FridgeDetection[]> {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) {
      const error = new Error("GEMINI_API_KEY is not configured");
      (error as Error & { statusCode?: number }).statusCode = 503;
      throw error;
    }

    const prompt = language === "vi"
      ? "Phân tích ảnh tủ lạnh. Liệt kê những nguyên liệu nấu ăn và đồ dùng nhà bếp nhìn thấy rõ. Không đoán những vật không chắc chắn. Trả về JSON hợp lệ duy nhất theo mẫu {\"items\":[{\"name\":\"\",\"category\":\"\",\"quantity\":\"\"}]}. Viết tên bằng tiếng Việt."
      : "Analyze this fridge image. List clearly visible cooking ingredients and kitchen items. Do not guess uncertain objects. Return only valid JSON in this shape: {\"items\":[{\"name\":\"\",\"category\":\"\",\"quantity\":\"\"}]}. Write names in English.";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: image } }] }],
          generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error("Gemini image analysis failed:", details);
      let providerMessage = "Image analysis service failed";
      try {
        const parsed = JSON.parse(details) as { error?: { message?: string } };
        if (parsed.error?.message) providerMessage = `Gemini: ${parsed.error.message}`;
      } catch {
        // Keep the provider error generic when the response is not JSON.
      }
      const error = new Error(providerMessage);
      (error as Error & { statusCode?: number }).statusCode = 502;
      throw error;
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("AI returned no image analysis");
    return parseDetections(text);
  },

  async suggestMeals(items: FridgeDetection[], language: "en" | "vi", filters: MealFilters, sessionId: string, userId?: string): Promise<MealSuggestion[]> {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) {
      const error = new Error("GEMINI_API_KEY is not configured");
      (error as Error & { statusCode?: number }).statusCode = 503;
      throw error;
    }

    const ingredientList = items.map((item) => `${item.name} (${item.quantity})`).join(", ");
    const filterSummary = `Meal type: ${filters.mealType}; high protein: ${filters.highProtein ? "yes" : "no"}; allergies to exclude: ${filters.allergies.join(", ") || "none"}`;
    const filterRules = filters.mealType === "vegetarian"
      ? "Vegetarian means no meat, poultry, fish, seafood, or animal-derived broth."
      : filters.mealType === "savory"
        ? "Savory means a non-dessert main or side dish; do not suggest cakes, candy, drinks, or sweet desserts."
        : filters.mealType === "sweet"
          ? "Sweet means a dessert or naturally sweet dish."
          : "No meal-type restriction; provide a varied selection.";
    const proteinRule = filters.highProtein ? "Prioritize meals with a substantial protein source such as meat, fish, eggs, tofu, beans, or lentils." : "High-protein is not required.";
    const allergyRule = filters.allergies.length > 0
      ? `Never include these allergens in availableIngredients, missingIngredients, or instructions: ${filters.allergies.join(", ")}.`
      : "No allergens were listed.";
    const prompt = language === "vi"
      ? `Dựa trên các nguyên liệu sau: ${ingredientList}. Bộ lọc: ${filterSummary}. Quy tắc bắt buộc: ${filterRules} ${proteinRule} ${allergyRule} Chỉ đề xuất món thực sự có thể nấu từ nguyên liệu đang có, có thể ghi một vài nguyên liệu cần mua thêm. Nếu không kiêng thì đề xuất đa dạng. Tối đa 5 món. Chỉ trả về JSON hợp lệ theo mẫu {"recipes":[{"name":"","description":"","availableIngredients":[],"missingIngredients":[],"instructions":[]}]}. Viết bằng tiếng Việt, hướng dẫn tối đa 5 bước.`
      : `Based on these ingredients: ${ingredientList}. User filters: ${filterSummary}. Mandatory rules: ${filterRules} ${proteinRule} ${allergyRule} Only suggest meals that can actually be made with the available ingredients; a few extra ingredients may be listed as missing. Suggest a varied selection when there is no restriction, with up to 5 meals. Return only valid JSON in this shape: {"recipes":[{"name":"","description":"","availableIngredients":[],"missingIngredients":[],"instructions":[]}]}. Write in English, with at most 5 instruction steps.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, responseMimeType: "application/json" },
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error("Gemini meal suggestions failed:", details);
      let providerMessage = "Meal suggestion service failed";
      const statusCode = response.status === 429 ? 429 : 502;
      try {
        const parsed = JSON.parse(details) as { error?: { message?: string } };
        if (parsed.error?.message) providerMessage = `Gemini: ${parsed.error.message}`;
      } catch {
        // Keep the provider error generic when the response is not JSON.
      }
      const error = new Error(providerMessage);
      (error as Error & { statusCode?: number }).statusCode = statusCode;
      throw error;
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("AI returned no meal suggestions");
    const suggestions = parseSuggestions(text);
    try {
      await MealSuggestionHistory.create({ sessionId, userId, language, filters, ingredients: items, suggestions });
    } catch (error) {
      console.error("Could not persist meal suggestions:", error);
    }
    return suggestions;
  },
};
