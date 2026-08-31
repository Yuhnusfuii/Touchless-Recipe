import mongoose, { Document, Schema, Types } from "mongoose";

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  actorId?: Types.ObjectId;
  type: "like" | "share" | "save" | "comment";
  postId?: Types.ObjectId;
  postTitle?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  actorId: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["like", "share", "save", "comment"], required: true },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  postTitle: { type: String, trim: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ recipientId: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
export default Notification;