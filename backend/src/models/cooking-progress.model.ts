import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICookingProgress extends Document {
  userId: Types.ObjectId;
  recipeId: string;
  recipeTitle: string;
  stepIndex: number;
  totalSteps: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  timerEndAt?: Date | null;
  updatedAt: Date;
}

const cookingProgressSchema = new Schema<ICookingProgress>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: { type: String, required: true, trim: true },
  recipeTitle: { type: String, required: true, trim: true },
  stepIndex: { type: Number, required: true, min: 0 },
  totalSteps: { type: Number, required: true, min: 1 },
  timerSeconds: { type: Number, required: true, min: 0 },
  isTimerRunning: { type: Boolean, default: false },
  timerEndAt: { type: Date, default: null },
}, { timestamps: true });

cookingProgressSchema.index({ userId: 1 }, { unique: true });

export const CookingProgress = mongoose.model<ICookingProgress>("CookingProgress", cookingProgressSchema);
export default CookingProgress;