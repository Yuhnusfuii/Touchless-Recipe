import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  image?: string;
  dietaryPrefs?: string;
  kcalTarget?: number;
  streak: number;
  lastCookingDate?: Date;
  cookedMealsCount: number;
  handsFreeSessionsCount: number;
  completedRecipeIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateUserDTO {
  email: string;
  password?: string;
  name: string;
  image?: string;
  dietaryPrefs?: string;
  kcalTarget?: number;
  streak?: number;
  cookedMealsCount?: number;
  handsFreeSessionsCount?: number;
}

export interface UpdateUserDTO {
  name?: string;
  image?: string;
  dietaryPrefs?: string;
  kcalTarget?: number;
  streak?: number;
  lastCookingDate?: Date;
  cookedMealsCount?: number;
  handsFreeSessionsCount?: number;
  completedRecipeIds?: string[];
}

export interface CookingProgressDTO {
  recipeId: string;
  currentStepIndex: number;
  totalSteps: number;
  isHandsFree?: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    image: {
      type: String,
    },
    dietaryPrefs: {
      type: String,
      default: "",
    },
    kcalTarget: {
      type: Number,
      default: 2000,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastCookingDate: {
      type: Date,
    },
    cookedMealsCount: {
      type: Number,
      default: 0,
    },
    handsFreeSessionsCount: {
      type: Number,
      default: 0,
    },
    completedRecipeIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
export default User;
