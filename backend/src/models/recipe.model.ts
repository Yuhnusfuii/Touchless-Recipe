import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRecipeIngredient {
  name: string;
  unit: string;
  amount: number;
}

export interface IRecipeStep {
  stepNumber: number;
  instruction: string;
  timerSeconds?: number;
}

export interface IRecipe extends Document {
  title: string;
  description?: string;
  prepTime: number;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  calories?: number;
  videoUrl?: string;
  imageUrl?: string;
  author: Types.ObjectId;
  ingredients: IRecipeIngredient[];
  steps: IRecipeStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredientInput {
  name: string;
  unit: string;
  amount: number;
}

export interface RecipeStepInput {
  stepNumber: number;
  instruction: string;
  timerSeconds?: number;
}

export interface CreateRecipeDTO {
  title: string;
  description?: string;
  prepTime: number;
  difficulty?: string;
  calories?: number;
  videoUrl?: string;
  imageUrl?: string;
  author: string;
  ingredients?: RecipeIngredientInput[];
  steps?: RecipeStepInput[];
}

export interface UpdateRecipeDTO {
  title?: string;
  description?: string;
  prepTime?: number;
  difficulty?: string;
  calories?: number;
  videoUrl?: string;
  imageUrl?: string;
  ingredients?: RecipeIngredientInput[];
  steps?: RecipeStepInput[];
}

const recipeIngredientSchema = new Schema<IRecipeIngredient>(
  {
    name: { type: String, required: true, trim: true },
    unit: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const recipeStepSchema = new Schema<IRecipeStep>(
  {
    stepNumber: { type: Number, required: true },
    instruction: { type: String, required: true },
    timerSeconds: { type: Number, default: 0 },
  },
  { _id: false }
);

const recipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    prepTime: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    calories: { type: Number },
    videoUrl: { type: String },
    imageUrl: { type: String },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ingredients: [recipeIngredientSchema],
    steps: [recipeStepSchema],
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

recipeSchema.index({ author: 1, createdAt: -1 });
recipeSchema.index({ title: "text", description: "text" });

export const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
export default Recipe;
