// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  getFavoriteRecipes,
  isFavoriteRecipe,
  toggleFavoriteRecipe,
  mealSuggestionToRecipe,
  FAVORITES_STORAGE_KEY,
} from "../lib/favorites";
import type { RecipeItem, MealSuggestion } from "../lib/api";

const mockRecipe: RecipeItem = {
  id: "test-recipe-1",
  title: "Test Teriyaki Chicken",
  description: "Delicious test chicken",
  category: "Chicken",
  area: "Japanese",
  prepTime: 25,
  difficulty: "Easy",
  calories: 450,
  imageUrl: "/images/test.jpg",
  source: "Test Suite",
  ingredients: [{ name: "Chicken", measure: "500g" }],
  steps: [{ stepNumber: 1, instruction: "Cook chicken" }],
};

describe("Favorites Helper Module", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return empty array when no favorites are saved", () => {
    expect(getFavoriteRecipes()).toEqual([]);
    expect(isFavoriteRecipe("test-recipe-1")).toBe(false);
  });

  it("should toggle recipe in and out of favorites", () => {
    const isAdded = toggleFavoriteRecipe(mockRecipe);
    expect(isAdded).toBe(true);
    expect(isFavoriteRecipe("test-recipe-1")).toBe(true);
    expect(getFavoriteRecipes()).toHaveLength(1);

    const isRemoved = toggleFavoriteRecipe(mockRecipe);
    expect(isRemoved).toBe(false);
    expect(isFavoriteRecipe("test-recipe-1")).toBe(false);
    expect(getFavoriteRecipes()).toHaveLength(0);
  });

  it("should convert MealSuggestion to RecipeItem", () => {
    const mealSuggestion: MealSuggestion = {
      name: "Smart Salmon Bowl",
      description: "Fresh salmon with rice",
      availableIngredients: ["Salmon", "Rice"],
      missingIngredients: ["Soy Sauce"],
      instructions: ["Cook rice", "Sear salmon"],
    };

    const recipe = mealSuggestionToRecipe(mealSuggestion, "Seafood");
    expect(recipe.title).toBe("Smart Salmon Bowl");
    expect(recipe.category).toBe("Seafood");
    expect(recipe.source).toBe("Smart Fridge AI");
    expect(recipe.ingredients).toHaveLength(3);
    expect(recipe.steps).toHaveLength(2);
  });
});
