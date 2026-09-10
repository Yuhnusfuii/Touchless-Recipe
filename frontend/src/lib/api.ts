const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface CookingAssistantContext {
  recipeTitle: string;
  ingredients: string[];
  steps: string[];
  currentStep: number;
  timerSeconds: number;
  timerRunning: boolean;
  conversation: Array<{ role: "user" | "assistant"; text: string }>;
}

export async function askCookingAssistant(question: string, context: CookingAssistantContext): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/cooking-assistant/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, context }),
  });
  const result = (await response.json().catch(() => ({}))) as ApiResponse<{ answer: string }>;
  if (!response.ok || !result.success || !result.data?.answer) throw new Error(result.message || "Trợ lý bếp hiện không phản hồi");
  return result.data.answer;
}

export interface FridgeAnalysisItem {
  name: string;
  category: string;
  quantity: string;
}

export interface MealSuggestion {
  name: string;
  description: string;
  availableIngredients: string[];
  missingIngredients: string[];
  instructions: string[];
}

export interface MealFilters {
  mealType: "vegetarian" | "savory" | "sweet" | "none";
  highProtein: boolean;
  allergies: string[];
}

export interface GeneratedMealPlanDay {
  date: string
  meals: Array<{ mealType: string; name: string; description: string; ingredients: string[]; calories: number }>
}

export type MealTime = "breakfast" | "lunch" | "dinner";

export interface GeneratedMealPlan {
  id?: string
  _id?: string
  startDate: string
  endDate: string
  period: "days" | "week" | "month"
  servings: number
  mealsPerDay: number
  mealsPerMeal: number
  mealTimes: MealTime[]
  dailyCalories: number
  goal: string
  tastes: string[]
  budget: number
  availableIngredients: string[]
  days: GeneratedMealPlanDay[]
}

function normalizeGeneratedMealPlan(plan: GeneratedMealPlan): GeneratedMealPlan {
  return {
    ...plan,
    id: plan.id || plan._id,
    mealsPerDay: typeof plan.mealsPerDay === "number" ? plan.mealsPerDay : 3,
    mealsPerMeal: typeof plan.mealsPerMeal === "number" ? plan.mealsPerMeal : 1,
    mealTimes: Array.isArray(plan.mealTimes) && plan.mealTimes.length > 0
      ? plan.mealTimes
      : ["lunch", "dinner"],
    dailyCalories: typeof plan.dailyCalories === "number" ? plan.dailyCalories : 2000,
    days: Array.isArray(plan.days) ? plan.days : [],
  }
}

export async function generateMealPlan(payload: Omit<GeneratedMealPlan, "id" | "days"> & { language: "vi" | "en"; userId?: string }): Promise<GeneratedMealPlan> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/meal-plans/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error("Không thể kết nối backend. Hãy khởi động server tại cổng 5000.")
  }
  const result = (await response.json().catch(() => ({}))) as ApiResponse<GeneratedMealPlan>
  if (!response.ok || !result.success) throw new Error(result.message || "Meal plan generation failed")
  if (!result.data) throw new Error("AI chưa tạo được kế hoạch bữa ăn")
  return normalizeGeneratedMealPlan(result.data)
}

export async function saveGeneratedMealPlan(plan: GeneratedMealPlan, userId: string): Promise<GeneratedMealPlan> {
  const response = await fetch(`${API_BASE_URL}/meal-plans/generated`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...plan, userId }),
  })
  const result = (await response.json().catch(() => ({}))) as ApiResponse<GeneratedMealPlan>
  if (!response.ok || !result.success || !result.data) throw new Error(result.message || "Không thể lưu thực đơn")
  return normalizeGeneratedMealPlan(result.data)
}

export async function getSavedMealPlans(userId: string): Promise<GeneratedMealPlan[]> {
  const response = await fetch(`${API_BASE_URL}/meal-plans/generated/user/${encodeURIComponent(userId)}`)
  const result = (await response.json().catch(() => ({}))) as ApiResponse<GeneratedMealPlan[]>
  if (!response.ok || !result.success) throw new Error(result.message || "Không thể tải thực đơn đã lưu")
  return (result.data || []).map(normalizeGeneratedMealPlan)
}

export async function deleteSavedMealPlan(id: string, userId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/meal-plans/generated/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  })
  const result = (await response.json().catch(() => ({}))) as ApiResponse
  if (!response.ok || !result.success) throw new Error(result.message || "Không thể xóa thực đơn")
}

export async function analyzeFridgeImage(
  image: string,
  mimeType: string,
  language: "en" | "vi"
): Promise<FridgeAnalysisItem[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/fridge/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, mimeType, language }),
    });
  } catch {
    throw new Error("Không thể kết nối backend AI. Hãy khởi động server backend tại cổng 5000.");
  }
  const result = (await response.json().catch(() => ({}))) as ApiResponse<FridgeAnalysisItem[]>;
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Image analysis failed");
  }
  return result.data || [];
}

export async function suggestMealsFromIngredients(
  items: FridgeAnalysisItem[],
  language: "en" | "vi",
  filters: MealFilters,
  sessionId: string,
  token?: string
): Promise<MealSuggestion[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/fridge/suggest`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ items, language, filters, sessionId }),
    });
  } catch {
    throw new Error("Không thể kết nối backend AI. Hãy khởi động server backend tại cổng 5000.");
  }
  const result = (await response.json().catch(() => ({}))) as ApiResponse<MealSuggestion[]>;
  if (!response.ok || !result.success) {
    if (response.status === 429) {
      throw new Error("Gemini đang hết quota miễn phí. Vui lòng chờ quota được cấp lại hoặc kiểm tra billing/API plan.");
    }
    throw new Error(result.message || "Meal suggestion failed");
  }
  return result.data || [];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  dietaryPrefs?: string;
  kcalTarget?: number;
  streak?: number;
  lastCookingDate?: string | Date;
  cookedMealsCount?: number;
  handsFreeSessionsCount?: number;
  completedRecipeIds?: string[];
  createdAt?: string;
}

export interface CookingProgressPayload {
  recipeId: string;
  currentStepIndex: number;
  totalSteps: number;
  isHandsFree?: boolean;
}

export interface CookingProgressResult {
  user: UserData;
  streak: number;
  cookedMealsCount: number;
  handsFreeSessionsCount: number;
  isNewlyCompleted: boolean;
  progressRatio: number;
}

export interface AuthResponseData {
  user: UserData;
  token: string;
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => ({
      success: false,
      message: "Không thể kết nối tới máy chủ (Server unreachable)",
    }))) as ApiResponse<AuthResponseData>;

    if (!res.ok) {
      throw new Error(data.message || "Đăng ký thất bại");
    }

    return data;
  },

  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
    let res: Response;
    try {
      res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error(
        "Không thể kết nối backend tại cổng 5000. Hãy khởi động backend và kiểm tra kết nối MongoDB."
      );
    }

    const data = (await res.json().catch(() => ({
      success: false,
      message: "Không thể kết nối tới máy chủ (Server unreachable)",
    }))) as ApiResponse<AuthResponseData>;

    if (!res.ok) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }

    return data;
  },

  async getMe(token: string): Promise<ApiResponse<UserData>> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return (await res.json()) as ApiResponse<UserData>;
  },

  async updateProfile(id: string, payload: Partial<UserData>): Promise<ApiResponse<UserData>> {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return (await res.json()) as ApiResponse<UserData>;
  },

  async recordCookingProgress(
    userId: string,
    payload: CookingProgressPayload
  ): Promise<ApiResponse<CookingProgressResult>> {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/cooking-progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return (await res.json()) as ApiResponse<CookingProgressResult>;
  },
};

export interface RecipeItem {
  id: string;
  title: string;
  description: string;
  category: string;
  area: string;
  prepTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  calories: number;
  imageUrl: string;
  videoUrl?: string;
  sourceUrl?: string;
  source: string;
  returnPath?: "/" | "/smart-fridge";
  fridgeMealId?: string;
  ingredients: Array<{
    name: string;
    measure: string;
  }>;
  steps: Array<{
    stepNumber: number;
    instruction: string;
    timerSeconds?: number;
  }>;
}

export const recipeApi = {
  async getRecipes(params?: {
    search?: string;
    category?: string;
    limit?: number;
  }): Promise<RecipeItem[]> {
    const search = params?.search || "";
    const category = params?.category && params.category !== "all" ? params.category : "";
    const limit = params?.limit || 12;

    const queryParams = new URLSearchParams();
    if (search) queryParams.set("search", search);
    if (category) queryParams.set("category", category);
    queryParams.set("limit", limit.toString());

    try {
      // 1. Try Backend API
      const res = await fetch(`${API_BASE_URL}/recipes?${queryParams.toString()}`);
      if (res.ok) {
        const json: ApiResponse<RecipeItem[]> = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn("Backend recipes endpoint unavailable, fallback to direct TheMealDB API:", e);
    }

    // 2. Direct Fallback to TheMealDB Public API
    try {
      let mealDbUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken";
      if (category) {
        mealDbUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`;
      } else if (search) {
        mealDbUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`;
      }

      const directRes = await fetch(mealDbUrl);
      const directData = (await directRes.json()) as {
        meals: Array<Record<string, string | null>> | null;
      };
      const meals = directData.meals || [];

      return meals
        .filter((m) => typeof m["idMeal"] === "string" && m["idMeal"])
        .slice(0, limit)
        .map((m, idx) => ({
        id: m["idMeal"] as string,
        title: m["strMeal"] || "Delicious Dish",
        description: `${m["strArea"] || "International"} style ${m["strCategory"] || "dish"} - Authentic culinary recipe.`,
        category: m["strCategory"] || category || "Main Course",
        area: m["strArea"] || "International",
        prepTime: 20 + ((idx * 5) % 25),
        difficulty: idx % 3 === 0 ? "Easy" : idx % 3 === 1 ? "Medium" : "Hard",
        calories: 380 + ((idx * 40) % 300),
        imageUrl: m["strMealThumb"] || "/images/roasted-harvest-bowl.jpg",
        videoUrl: m["strYoutube"] || undefined,
        sourceUrl: `https://www.themealdb.com/meal/${m["idMeal"]}`,
        source: "TheMealDB",
        ingredients: [],
        steps: [],
      }));
    } catch (fallbackError) {
      console.error("Failed to fetch recipes:", fallbackError);
      return [];
    }
  },

  async getRecipeById(id: string): Promise<RecipeItem | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/recipes/${id}`);
      if (res.ok) {
        const json: ApiResponse<RecipeItem> = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn("Backend recipe detail unavailable:", e);
    }

    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = (await res.json()) as {
        meals: Array<Record<string, string | null>> | null;
      };
      if (data.meals?.[0]) {
        const meal = data.meals[0];
        return {
          id: meal["idMeal"] || id,
          title: meal["strMeal"] || "Recipe",
          description: `${meal["strArea"] || "International"} style ${meal["strCategory"] || "cuisine"}.`,
          category: meal["strCategory"] || "Main Course",
          area: meal["strArea"] || "International",
          prepTime: 25,
          difficulty: "Easy",
          calories: 450,
          imageUrl: meal["strMealThumb"] || "/images/roasted-harvest-bowl.jpg",
          videoUrl: meal["strYoutube"] || undefined,
          sourceUrl:
            typeof meal["strSource"] === "string" && /^https?:\/\//i.test(meal["strSource"])
              ? meal["strSource"]
              : `https://www.themealdb.com/meal/${meal["idMeal"] || id}`,
          source: "TheMealDB",
          ingredients: [],
          steps: [],
        };
      }
    } catch (err) {
      console.error("Lookup error:", err);
    }

    return null;
  },
};
