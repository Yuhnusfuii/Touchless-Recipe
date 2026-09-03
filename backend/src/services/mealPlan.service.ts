import MealPlan, { CreateMealPlanDTO } from "../models/mealPlan.model.js";
import { jsonrepair } from "jsonrepair";
import { GeneratedMealPlan, type GeneratedMealPlanDay } from "../models/generatedMealPlan.model.js";

export type GenerateMealPlanDTO = {
  userId?: string;
  startDate: string;
  endDate: string;
  period: "days" | "week" | "month";
  servings: number;
  mealsPerDay: number;
  dailyCalories: number;
  goal: string;
  tastes: string[];
  budget: number;
  availableIngredients: string[];
  language: "vi" | "en";
};

export type SaveGeneratedMealPlanDTO = Omit<GenerateMealPlanDTO, "language"> & {
  days: GeneratedMealPlanDay[];
};

function parsePlan(text: string): GeneratedMealPlanDay[] {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  const parsed = JSON.parse(jsonrepair(text.slice(start, end + 1))) as { days?: unknown[] };
  return (parsed.days || []).filter((day): day is Record<string, unknown> => Boolean(day) && typeof day === "object").map((day) => ({
    date: typeof day.date === "string" ? day.date : "",
    meals: Array.isArray(day.meals) ? day.meals.filter((meal): meal is Record<string, unknown> => Boolean(meal) && typeof meal === "object").map((meal) => ({
      mealType: typeof meal.mealType === "string" ? meal.mealType : "Dinner",
      name: typeof meal.name === "string" ? meal.name : "Meal",
      description: typeof meal.description === "string" ? meal.description : "",
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients.filter((item): item is string => typeof item === "string") : [],
      calories: typeof meal.calories === "number" ? meal.calories : 0,
    })) : [],
  }));
}

export class MealPlanService {
  async generateMealPlan(data: GenerateMealPlanDTO) {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) throw Object.assign(new Error("GEMINI_API_KEY is not configured"), { statusCode: 503 });
    const prompt = data.language === "vi"
      ? `Tạo kế hoạch bữa ăn từ ${data.startDate} đến ${data.endDate}. Số người: ${data.servings}. Số món mỗi ngày: ${data.mealsPerDay}. Mục tiêu kcal mỗi ngày: ${data.dailyCalories}. Mục tiêu: ${data.goal}. Khẩu vị: ${data.tastes.join(", ") || "đa dạng"}. Ngân sách tổng: ${data.budget}. Nguyên liệu đang có: ${data.availableIngredients.join(", ") || "không có"}. Ưu tiên dùng nguyên liệu có sẵn, phù hợp ngân sách, mục tiêu và tổng kcal mỗi ngày. Mỗi ngày phải có đúng ${data.mealsPerDay} món, chia theo bữa hợp lý. Trả về JSON duy nhất dạng {"days":[{"date":"YYYY-MM-DD","meals":[{"mealType":"Breakfast","name":"","description":"","ingredients":[],"calories":0}]}]}. Tối đa 31 ngày.`
      : `Create a meal plan from ${data.startDate} to ${data.endDate}. Servings: ${data.servings}. Meals per day: ${data.mealsPerDay}. Daily calorie target: ${data.dailyCalories} kcal. Goal: ${data.goal}. Tastes: ${data.tastes.join(", ") || "varied"}. Total budget: ${data.budget}. Available ingredients: ${data.availableIngredients.join(", ") || "none"}. Prioritize available ingredients and respect budget, goal, and daily calories. Return exactly ${data.mealsPerDay} meals per day, distributed across meal types. Return only JSON shaped as {"days":[{"date":"YYYY-MM-DD","meals":[{"mealType":"Breakfast","name":"","description":"","ingredients":[],"calories":0}]}]}. Maximum 31 days.`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env["GEMINI_MODEL"] || "gemini-3.5-flash-lite"}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.25, responseMimeType: "application/json" } }), signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw Object.assign(new Error(`Gemini: ${await response.text()}`), { statusCode: response.status === 429 ? 429 : 502 });
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const days = parsePlan(payload.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    return { ...data, days };
  }

  async saveGeneratedMealPlan(data: SaveGeneratedMealPlanDTO) {
    return GeneratedMealPlan.create(data);
  }

  async getGeneratedMealPlansByUser(userId: string) {
    return GeneratedMealPlan.find({ userId }).populate("userId", "name email image").sort({ createdAt: -1 }).limit(20);
  }

  async deleteGeneratedMealPlan(id: string, userId: string) {
    return GeneratedMealPlan.findOneAndDelete({ _id: id, userId });
  }

  async getMealPlansByUser(userId: string) {
    return MealPlan.find({ user: userId })
      .populate("user", "name email image")
      .populate("recipe")
      .sort({ date: 1 });
  }

  async createMealPlan(data: CreateMealPlanDTO) {
    return MealPlan.create({
      user: data.userId,
      recipe: data.recipeId,
      date: new Date(data.date),
      mealType: data.mealType,
    });
  }

  async deleteMealPlan(id: string) {
    return MealPlan.findByIdAndDelete(id);
  }
}

export const mealPlanService = new MealPlanService();

