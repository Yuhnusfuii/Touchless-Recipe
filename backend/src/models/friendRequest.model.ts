import mongoose, { Document, Schema } from "mongoose";

export type FriendRequestStatus = "pending" | "accepted" | "declined";

export interface IFriendRequest extends Document {
  requesterId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  status: FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  },
  { timestamps: true }
);

friendRequestSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });

export const FriendRequest = mongoose.model<IFriendRequest>("FriendRequest", friendRequestSchema);
export default FriendRequest;
