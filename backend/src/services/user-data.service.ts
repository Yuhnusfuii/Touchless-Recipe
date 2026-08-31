import Favorite from "../models/favorite.model.js";
import Notification from "../models/notification.model.js";
import CookingProgress from "../models/cooking-progress.model.js";

export class UserDataService {
  getFavorites(userId: string) { return Favorite.find({ userId }).sort({ createdAt: -1 }).lean(); }

  async toggleFavorite(userId: string, targetType: "recipe" | "post", targetId: string, snapshot?: Record<string, unknown>) {
    const existing = await Favorite.findOne({ userId, targetType, targetId });
    if (existing) { await existing.deleteOne(); return { saved: false }; }
    await Favorite.create({ userId, targetType, targetId, snapshot });
    return { saved: true };
  }

  getNotifications(userId: string) { return Notification.find({ recipientId: userId }).sort({ createdAt: -1 }).limit(50).lean(); }
  markNotificationsRead(userId: string) { return Notification.updateMany({ recipientId: userId, read: false }, { $set: { read: true } }); }

  getCookingProgress(userId: string) { return CookingProgress.findOne({ userId }).lean(); }
  saveCookingProgress(userId: string, data: Record<string, unknown>) {
    return CookingProgress.findOneAndUpdate({ userId }, { $set: { ...data, userId } }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
  }
  clearCookingProgress(userId: string) { return CookingProgress.findOneAndDelete({ userId }); }
}

export const userDataService = new UserDataService();