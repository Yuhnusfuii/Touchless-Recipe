import mongoose from "mongoose";
import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";

function publicUser(user: { _id: mongoose.Types.ObjectId; name: string; image?: string }) {
  return { id: user._id.toString(), name: user.name, image: user.image, role: "Home cook", initials: user.name.slice(0, 2).toUpperCase(), mutualFriends: 0 };
}

export class FriendsService {
  async getSnapshot(userId: string) {
    const currentUserId = new mongoose.Types.ObjectId(userId);
    const relationships = await FriendRequest.find({ $or: [{ requesterId: currentUserId }, { recipientId: currentUserId }] }).lean();
    const connectedIds = relationships.filter((item) => item.status === "accepted").map((item) => item.requesterId.equals(currentUserId) ? item.recipientId : item.requesterId);
    const pendingIncomingIds = relationships.filter((item) => item.status === "pending" && item.recipientId.equals(currentUserId)).map((item) => item.requesterId);
    const excludedIds = [...connectedIds, ...pendingIncomingIds, currentUserId];
    const [friends, requestUsers, suggestions] = await Promise.all([
      User.find({ _id: { $in: connectedIds } }).select("name image").lean(),
      User.find({ _id: { $in: pendingIncomingIds } }).select("name image").lean(),
      User.find({ _id: { $nin: excludedIds } }).select("name image").sort({ createdAt: -1 }).limit(20).lean(),
    ]);
    const incomingRequests = relationships.filter((item) => item.status === "pending" && item.recipientId.equals(currentUserId));
    const requestUserById = new Map(requestUsers.map((user) => [user._id.toString(), user]));
    return {
      friends: friends.map((user) => publicUser(user)),
      requests: incomingRequests.flatMap((request) => {
        const user = requestUserById.get(request.requesterId.toString());
        return user ? [{ ...publicUser(user), id: request._id.toString(), sentAt: "Pending" }] : [];
      }),
      suggestions: suggestions.map((user) => publicUser(user)),
    };
  }

  async sendRequest(userId: string, recipientId: string) {
    if (userId === recipientId) throw new Error("You cannot send a friend request to yourself");
    const recipient = await User.findById(recipientId).select("_id");
    if (!recipient) throw new Error("User not found");
    const existing = await FriendRequest.findOne({ requesterId: userId, recipientId });
    if (existing?.status === "pending" || existing?.status === "accepted") throw new Error("Friend request already exists");
    const reverse = await FriendRequest.findOne({ requesterId: recipientId, recipientId: userId, status: "pending" });
    if (reverse) throw new Error("This user already sent you a friend request");
    return FriendRequest.findOneAndUpdate({ requesterId: userId, recipientId }, { status: "pending" }, { upsert: true, new: true });
  }

  async updateRequest(userId: string, requestId: string, status: "accepted" | "declined") {
    const request = await FriendRequest.findOneAndUpdate({ _id: requestId, recipientId: userId, status: "pending" }, { status }, { new: true });
    if (!request) throw new Error("Friend request not found");
    return request;
  }
}

export const friendsService = new FriendsService();
