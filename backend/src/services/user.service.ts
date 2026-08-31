import User, {
  CookingProgressDTO,
  CreateUserDTO,
  UpdateUserDTO,
} from "../models/user.model.js";

export class UserService {
  async getAllUsers() {
    return User.find().sort({ createdAt: -1 });
  }

  async getUserById(id: string) {
    return User.findById(id);
  }

  async getUserByEmail(email: string) {
    return User.findOne({ email });
  }

  async createUser(data: CreateUserDTO) {
    return User.create(data);
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    return User.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  async recordCookingProgress(userId: string, data: CookingProgressDTO) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    let currentStreak = user.streak || 0;

    // 1. Calculate cooking streak (chuỗi ngày liên tục)
    if (!user.lastCookingDate) {
      currentStreak = 1;
    } else {
      const lastDate = new Date(user.lastCookingDate);
      const isSameDay = now.toDateString() === lastDate.toDateString();

      if (!isSameDay) {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = yesterday.toDateString() === lastDate.toDateString();

        if (isYesterday) {
          currentStreak += 1; // Consecutive day cooking
        } else {
          currentStreak = 1; // Missed days, streak resets to 1
        }
      } else {
        // Cooked again on same day
        if (currentStreak === 0) currentStreak = 1;
      }
    }

    user.streak = currentStreak;
    user.lastCookingDate = now;

    // 2. Calculate Cooked Meals Count ("Món đã thực hiện" > 50% tổng số bước)
    const { recipeId, currentStepIndex, totalSteps, isHandsFree } = data;
    const progressRatio = totalSteps > 0 ? (currentStepIndex + 1) / totalSteps : 0;
    let isNewlyCompleted = false;

    if (!user.completedRecipeIds) {
      user.completedRecipeIds = [];
    }

    // If completed over 50% steps (> 0.5) and not already recorded for this recipe
    if (progressRatio > 0.5) {
      if (!user.completedRecipeIds.includes(recipeId)) {
        user.completedRecipeIds.push(recipeId);
        user.cookedMealsCount = (user.cookedMealsCount || 0) + 1;
        isNewlyCompleted = true;
      }
    }

    // 3. Increment hands-free session count if applicable
    if (isHandsFree) {
      user.handsFreeSessionsCount = (user.handsFreeSessionsCount || 0) + 1;
    }

    await user.save();

    return {
      user,
      streak: user.streak,
      cookedMealsCount: user.cookedMealsCount,
      handsFreeSessionsCount: user.handsFreeSessionsCount,
      isNewlyCompleted,
      progressRatio,
    };
  }

  async deleteUser(id: string) {
    return User.findByIdAndDelete(id);
  }
}

export const userService = new UserService();

