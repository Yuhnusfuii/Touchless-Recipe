import mongoose, { Document, Schema, Types } from "mongoose";

export interface GeneratedMealPlanDay {
  date: string;
  meals: Array<{
    mealType: string;
    name: string;
    description: string;
    ingredients: string[];
    calories: number;
  }>;
}

export interface IGeneratedMealPlan extends Document {
  userId?: Types.ObjectId;
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
  days: GeneratedMealPlanDay[];
  createdAt: Date;
  updatedAt: Date;
}

const generatedMealPlanSchema = new Schema<IGeneratedMealPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    period: { type: String, enum: ["days", "week", "month"], required: true },
    servings: { type: Number, required: true },
    mealsPerDay: { type: Number, required: true },
    dailyCalories: { type: Number, required: true },
    goal: { type: String, required: true },
    tastes: { type: [String], default: [] },
    budget: { type: Number, required: true },
    availableIngredients: { type: [String], default: [] },
    days: { type: Schema.Types.Mixed, required: true } as any,
  },
  { timestamps: true, toJSON: { transform: (_doc, ret: Record<string, any>) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } } }
);

export const GeneratedMealPlan = mongoose.model<IGeneratedMealPlan>("GeneratedMealPlan", generatedMealPlanSchema);