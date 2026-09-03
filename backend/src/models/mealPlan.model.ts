import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMealPlan extends Document {
  user: Types.ObjectId;
  recipe: Types.ObjectId;
  date: Date;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack" | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMealPlanDTO {
  userId: string;
  recipeId: string;
  date: Date | string;
  mealType: string;
}

const mealPlanSchema = new Schema<IMealPlan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipe: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mealType: {
      type: String,
      required: true,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      default: "Dinner",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

mealPlanSchema.index({ user: 1, date: 1, mealType: 1 }, { unique: true });
mealPlanSchema.index({ user: 1, date: 1 });

export const MealPlan = mongoose.model<IMealPlan>("MealPlan", mealPlanSchema);
export default MealPlan;
