import Recipe, { CreateRecipeDTO, UpdateRecipeDTO } from "../models/recipe.model.js";

export interface StandardRecipe {
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
  source: "TheMealDB" | "Community";
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

export class RecipeService {
  private getMealSourceUrl(meal: any): string | undefined {
    const mealId = typeof meal.idMeal === "string" ? meal.idMeal.trim() : "";
    if (!mealId) return undefined;

    const declaredSource = typeof meal.strSource === "string" ? meal.strSource.trim() : "";
    if (declaredSource) {
      try {
        const sourceUrl = new URL(declaredSource);
        if (sourceUrl.protocol === "http:" || sourceUrl.protocol === "https:") {
          return sourceUrl.toString();
        }
      } catch {
        // Use the verified TheMealDB page when the declared source is malformed.
      }
    }

    return `https://www.themealdb.com/meal/${mealId}`;
  }

  private formatMealDBRecipe(meal: any): StandardRecipe {
    // Extract ingredients & measures
    const ingredients: Array<{ name: string; measure: string }> = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure ? measure.trim() : "To taste",
        });
      }
    }

    // Split instructions into steps
    const rawSteps = (meal.strInstructions || "")
      .split(/\r\n|\n|\r/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 15 && !s.toLowerCase().startsWith("step"));

    const steps =
      rawSteps.length > 0
        ? rawSteps.map((instruction: string, idx: number) => {
            // Check for timers in instructions (e.g. 5 minutes, 10 mins)
            const minMatch = instruction.match(/(\d+)\s*(?:minutes|mins|min)/i);
            const timerSeconds = minMatch ? parseInt(minMatch[1] || "0", 10) * 60 : undefined;
            return {
              stepNumber: idx + 1,
              instruction,
              timerSeconds,
            };
          })
        : [
            {
              stepNumber: 1,
              instruction: meal.strInstructions || "Follow standard preparation methods.",
            },
          ];

    // Estimate prep time & calories & difficulty
    const stepCount = steps.length;
    const prepTime = Math.min(60, Math.max(15, stepCount * 6 + 5));
    const calories = 350 + (ingredients.length % 5) * 65;
    const difficulty: "Easy" | "Medium" | "Hard" =
      stepCount <= 4 ? "Easy" : stepCount <= 8 ? "Medium" : "Hard";

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: `${meal.strArea || "International"} style ${meal.strCategory || "cuisine"} - Authentic authentic recipe curated from professional culinary archives.`,
      category: meal.strCategory || "Main Course",
      area: meal.strArea || "International",
      prepTime,
      difficulty,
      calories,
      imageUrl: meal.strMealThumb || "/images/roasted-harvest-bowl.jpg",
      videoUrl: meal.strYoutube || undefined,
      sourceUrl: this.getMealSourceUrl(meal),
      source: "TheMealDB",
      ingredients,
      steps,
    };
  }

  async getAuthenticRecipes(search?: string, category?: string, limit = 12): Promise<StandardRecipe[]> {
    try {
      let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

      if (category && category.toLowerCase() !== "all") {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`;
      } else if (search && search.trim()) {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search.trim())}`;
      } else {
        // Default popular curated query
        url = "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken";
      }

      const res = await fetch(url);
      const data: any = await res.json();

      if (!data.meals || !Array.isArray(data.meals)) {
        // Fallback search with empty string to get standard list
        const fallbackRes = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=a");
        const fallbackData: any = await fallbackRes.json();
        const fallbackMeals = fallbackData.meals || [];
        return fallbackMeals.slice(0, limit).map((m: any) => this.formatMealDBRecipe(m));
      }

      // If category filter was used, TheMealDB filter.php only returns idMeal, strMeal, strMealThumb.
      // We hydrate the first few items to have full step details.
      const mealsToProcess = data.meals.filter((meal: any) => meal?.idMeal).slice(0, limit);
      const formatted: StandardRecipe[] = [];

      for (const meal of mealsToProcess) {
        if (!meal.strInstructions && meal.idMeal) {
          try {
            const detailRes = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            );
            const detailData: any = await detailRes.json();
            if (detailData.meals?.[0]) {
              formatted.push(this.formatMealDBRecipe(detailData.meals[0]));
              continue;
            }
          } catch (e) {
            console.error("Failed to lookup meal detail", e);
          }
        }
        formatted.push(this.formatMealDBRecipe(meal));
      }

      return formatted;
    } catch (error) {
      console.error("TheMealDB API error, fallback to database:", error);
      const localRecipes = await this.getAllRecipes(search);
      return localRecipes.map((r: any) => ({
        id: r._id.toString(),
        title: r.title,
        description: r.description || "",
        category: "Community",
        area: "International",
        prepTime: r.prepTime || 20,
        difficulty: (r.difficulty as any) || "Easy",
        calories: r.calories || 400,
        imageUrl: r.imageUrl || "/images/market-garden-salad.jpg",
        source: "Community",
        ingredients: (r.ingredients || []).map((i: any) => ({
          name: i.name,
          measure: `${i.amount} ${i.unit}`,
        })),
        steps: (r.steps || []).map((s: any) => ({
          stepNumber: s.stepNumber,
          instruction: s.instruction,
          timerSeconds: s.timerSeconds,
        })),
      }));
    }
  }

  async getRecipeDetails(id: string): Promise<StandardRecipe | null> {
    // 1. Try TheMealDB lookup
    if (/^\d+$/.test(id)) {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data: any = await res.json();
        if (data.meals?.[0]) {
          return this.formatMealDBRecipe(data.meals[0]);
        }
      } catch (err) {
        console.error("Error looking up TheMealDB recipe:", err);
      }
    }

    // 2. Try MongoDB
    const local = await Recipe.findById(id).populate("author", "name email image");
    if (local) {
      const r = local as any;
      return {
        id: r._id.toString(),
        title: r.title,
        description: r.description || "",
        category: "Community",
        area: "International",
        prepTime: r.prepTime || 20,
        difficulty: r.difficulty || "Easy",
        calories: r.calories || 400,
        imageUrl: r.imageUrl || "/images/market-garden-salad.jpg",
        source: "Community",
        ingredients: (r.ingredients || []).map((i: any) => ({
          name: i.name,
          measure: `${i.amount} ${i.unit}`,
        })),
        steps: (r.steps || []).map((s: any) => ({
          stepNumber: s.stepNumber,
          instruction: s.instruction,
          timerSeconds: s.timerSeconds,
        })),
      };
    }

    return null;
  }

  async getAllRecipes(search?: string, difficulty?: string) {
    const filter: Record<string, unknown> = {};

    if (search) {
      filter["title"] = { $regex: search, $options: "i" };
    }

    if (difficulty) {
      filter["difficulty"] = difficulty;
    }

    return Recipe.find(filter)
      .populate("author", "name email image")
      .sort({ createdAt: -1 });
  }

  async getRecipeById(id: string) {
    return Recipe.findById(id).populate("author", "name email image");
  }

  async createRecipe(data: CreateRecipeDTO) {
    const recipe = await Recipe.create(data);
    return recipe.populate("author", "name email image");
  }

  async updateRecipe(id: string, data: UpdateRecipeDTO) {
    return Recipe.findByIdAndUpdate(id, { $set: data }, { new: true }).populate(
      "author",
      "name email image"
    );
  }

  async deleteRecipe(id: string) {
    return Recipe.findByIdAndDelete(id);
  }
}

export const recipeService = new RecipeService();

