import type { MealSuggestion, RecipeItem } from "./api"

export const FAVORITES_STORAGE_KEY = "favorite_recipes"
export const FAVORITES_CHANGE_EVENT = "favorite-recipes-change"

export function getFavoriteRecipes(): RecipeItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]")
    return Array.isArray(stored) ? stored as RecipeItem[] : []
  } catch {
    return []
  }
}

export function isFavoriteRecipe(id: string) {
  return getFavoriteRecipes().some((recipe) => recipe.id === id)
}

export function toggleFavoriteRecipe(recipe: RecipeItem) {
  const favorites = getFavoriteRecipes()
  const exists = favorites.some((item) => item.id === recipe.id)
  const next = exists ? favorites.filter((item) => item.id !== recipe.id) : [recipe, ...favorites]
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT))
  return !exists
}

export function mealSuggestionToRecipe(meal: MealSuggestion, category: string): RecipeItem {
  const id = `ai-${meal.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`
  return {
    id,
    title: meal.name,
    description: meal.description,
    category,
    area: "",
    prepTime: 30,
    difficulty: "Easy",
    calories: 0,
    imageUrl: "/images/roasted-harvest-bowl.jpg",
    source: "Smart Fridge AI",
    returnPath: "/smart-fridge",
    fridgeMealId: id,
    ingredients: [...meal.availableIngredients, ...meal.missingIngredients]
      .filter((ingredient, index, all) => ingredient.trim() && all.findIndex((entry) => entry.toLowerCase() === ingredient.toLowerCase()) === index)
      .map((ingredient) => ({ name: ingredient, measure: "" })),
    steps: meal.instructions.map((instruction, index) => ({ stepNumber: index + 1, instruction })),
  }
}
