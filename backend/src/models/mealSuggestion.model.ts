import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMealSuggestionHistory extends Document {
  sessionId: string;
  userId?: Types.ObjectId;
  language: "en" | "vi";
  filters: {
    mealType: "vegetarian" | "savory" | "sweet" | "none";
    highProtein: boolean;
    allergies: string[];
  };
  ingredients: Array<{ name: string; category: string; quantity: string }>;
  suggestions: Array<{
    name: string;
    description: string;
    availableIngredients: string[];
    missingIngredients: string[];
    instructions: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const mealSuggestionHistorySchema = new Schema<IMealSuggestionHistory>(
  {
    sessionId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    language: { type: String, enum: ["en", "vi"], required: true },
    filters: {
      mealType: { type: String, enum: ["vegetarian", "savory", "sweet", "none"], required: true },
      highProtein: { type: Boolean, required: true },
      allergies: { type: [String], default: [] },
    },
    ingredients: { type: [{ name: String, category: String, quantity: String }], required: true },
    suggestions: { type: [{ name: String, description: String, availableIngredients: [String], missingIngredients: [String], instructions: [String] }], required: true },
  },
  { timestamps: true }
);

export const MealSuggestionHistory = mongoose.model<IMealSuggestionHistory>(
  "MealSuggestionHistory",
  mealSuggestionHistorySchema
);

mealSuggestionHistorySchema.index({ userId: 1, createdAt: -1 });