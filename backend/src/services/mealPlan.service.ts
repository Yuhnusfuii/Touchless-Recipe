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
  mealsPerMeal: number;
  mealTimes: Array<"breakfast" | "lunch" | "dinner">;
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
    const mealTimes = data.mealTimes.filter((mealTime, index, values) =>
      ["breakfast", "lunch", "dinner"].includes(mealTime) && values.indexOf(mealTime) === index,
    );
    const requestedMealTimes = mealTimes.length > 0 ? mealTimes : ["lunch", "dinner"] as const;
    const requestedMealsPerMeal = Math.max(1, Math.min(6, Math.floor(data.mealsPerMeal)));
    const requestedMealsPerDay = requestedMealTimes.length * requestedMealsPerMeal;
    const mealLabels = requestedMealTimes.map((mealTime) =>
      mealTime === "breakfast" ? "Breakfast" : mealTime === "lunch" ? "Lunch" : "Dinner",
    ).join(", ");
    const prompt = data.language === "vi"
      ? `Tạo kế hoạch bữa ăn từ ${data.startDate} đến ${data.endDate}. Số người: ${data.servings}. Mỗi buổi đã chọn (${mealLabels}) phải có đúng ${requestedMealsPerMeal} món, tổng cộng ${requestedMealsPerDay} món mỗi ngày. Chỉ tạo món cho các buổi đã chọn, không thêm buổi khác và không được bỏ sót buổi nào. Món ăn phải dễ nấu tại nhà, ưu tiên thời gian chuẩn bị và nấu không quá 45 phút, nguyên liệu dễ tìm và hướng dẫn đơn giản. Các ngày phải phong phú: không lặp lại cùng một món, thay đổi nguồn đạm, rau củ và cách chế biến. Tuân thủ đồng thời mục tiêu ${data.goal}, khẩu vị ${data.tastes.join(", ") || "đa dạng"}, ngân sách ${data.budget}, nguyên liệu sẵn có ${data.availableIngredients.join(", ") || "không có"}, số người ${data.servings} và tổng ${data.dailyCalories} kcal mỗi ngày. Trả về JSON duy nhất dạng {"days":[{"date":"YYYY-MM-DD","meals":[{"mealType":"${mealLabels.split(", ")[0]}","name":"","description":"","ingredients":[],"calories":0}]}]}. Tối đa 31 ngày.`
      : `Create a meal plan from ${data.startDate} to ${data.endDate}. Servings: ${data.servings}. For EACH selected meal time (${mealLabels}), return exactly ${requestedMealsPerMeal} dishes, for a total of ${requestedMealsPerDay} dishes per day. Create dishes only for the selected meal times, do not add unselected times, and do not omit any selected time. Every dish must be easy to cook at home, preferably ready within 45 minutes with accessible ingredients and simple instructions. Keep the days varied: do not repeat the same dish, rotate proteins, vegetables, and cooking methods. Satisfy all entered criteria together: goal ${data.goal}, tastes ${data.tastes.join(", ") || "varied"}, budget ${data.budget}, available ingredients ${data.availableIngredients.join(", ") || "none"}, servings ${data.servings}, and ${data.dailyCalories} kcal per day. Return only JSON shaped as {"days":[{"date":"YYYY-MM-DD","meals":[{"mealType":"${mealLabels.split(", ")[0]}","name":"","description":"","ingredients":[],"calories":0}]}]}. Maximum 31 days.`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env["GEMINI_MODEL"] || "gemini-3.5-flash-lite"}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.25, responseMimeType: "application/json" } }), signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw Object.assign(new Error(`Gemini: ${await response.text()}`), { statusCode: response.status === 429 ? 429 : 502 });
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const days = parsePlan(payload.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    return { ...data, mealsPerDay: requestedMealsPerDay, mealsPerMeal: requestedMealsPerMeal, mealTimes: requestedMealTimes, days };
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

