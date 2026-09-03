import { authApi, type UserData } from "./api";

export interface CookingActivityParams {
  recipeId: string;
  currentStepIndex: number;
  totalSteps: number;
  isHandsFree?: boolean;
}

export interface CookingActivityResult {
  streak: number;
  cookedMealsCount: number;
  isNewlyCompleted: boolean;
  progressRatio: number;
}

/**
 * Tracks kitchen activity:
 * 1. Cooking Streak (Chuỗi ngày liên tục): Incremented when user cooks on consecutive calendar days.
 *    - Same day: maintains streak
 *    - Yesterday: streak + 1
 *    - Missed > 1 day: resets streak to 1
 * 2. Cooked Meals (Món đã thực hiện): Credited when user completes > 50% of the recipe steps.
 * 3. Hands-free Sessions (Lần nấu rảnh tay): Incremented when gesture/voice is used.
 */
export async function trackCookingActivity(
  params: CookingActivityParams
): Promise<CookingActivityResult> {
  if (typeof window === "undefined") {
    return {
      streak: 1,
      cookedMealsCount: 0,
      isNewlyCompleted: false,
      progressRatio: 0,
    };
  }

  const userJson = localStorage.getItem("user");
  const user: UserData | null = userJson ? JSON.parse(userJson) : null;

  const now = new Date();
  let currentStreak = user?.streak ?? 0;

  // 1. Calculate streak (Chuỗi ngày liên tục)
  if (!user?.lastCookingDate) {
    currentStreak = 1;
  } else {
    const lastDate = new Date(user.lastCookingDate);
    const isSameDay = now.toDateString() === lastDate.toDateString();

    if (!isSameDay) {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = yesterday.toDateString() === lastDate.toDateString();

      if (isYesterday) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    } else {
      if (currentStreak === 0) currentStreak = 1;
    }
  }

  // 2. Check > 50% recipe steps completed ("Món đã thực hiện")
  const progressRatio =
    params.totalSteps > 0 ? (params.currentStepIndex + 1) / params.totalSteps : 0;
  let isNewlyCompleted = false;
  const completedList = [...(user?.completedRecipeIds || [])];
  let cookedMeals = user?.cookedMealsCount ?? 0;

  if (progressRatio > 0.5) {
    if (!completedList.includes(params.recipeId)) {
      completedList.push(params.recipeId);
      cookedMeals += 1;
      isNewlyCompleted = true;
    }
  }

  const handsFreeCount =
    (user?.handsFreeSessionsCount ?? 0) + (params.isHandsFree ? 1 : 0);

  // Update localStorage immediately
  if (user) {
    const updatedUser: UserData = {
      ...user,
      streak: currentStreak,
      lastCookingDate: now,
      cookedMealsCount: cookedMeals,
      completedRecipeIds: completedList,
      handsFreeSessionsCount: handsFreeCount,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("storage"));

    // Sync to MongoDB Backend if user is authenticated
    if (user.id) {
      try {
        const res = await authApi.recordCookingProgress(user.id, params);
        if (res.success && res.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          window.dispatchEvent(new Event("storage"));
        }
      } catch (err) {
        console.warn("Backend cooking activity sync failed, kept locally:", err);
      }
    }
  }

  return {
    streak: currentStreak,
    cookedMealsCount: cookedMeals,
    isNewlyCompleted,
    progressRatio,
  };
}
