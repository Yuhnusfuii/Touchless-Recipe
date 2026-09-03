import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFavorite extends Document {
  userId: Types.ObjectId;
  targetType: "recipe" | "post";
  targetId: string;
  snapshot?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  targetType: { type: String, enum: ["recipe", "post"], required: true },
  targetId: { type: String, required: true, trim: true },
  snapshot: { type: Schema.Types.Mixed },
}, { timestamps: true });

favoriteSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });
favoriteSchema.index({ userId: 1, createdAt: -1 });

export const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
export default Favorite;