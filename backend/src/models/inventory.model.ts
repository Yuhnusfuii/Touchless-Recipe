import mongoose, { Document, Schema, Types } from "mongoose";

export interface IInventoryItem extends Document {
  user: Types.ObjectId;
  ingredientName: string;
  unit: string;
  quantity: number;
  expirationDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInventoryItemDTO {
  userId: string;
  ingredientName: string;
  unit: string;
  quantity: number;
  expirationDate?: Date | string;
}

export interface UpdateInventoryItemDTO {
  quantity?: number;
  expirationDate?: Date | string;
}

const inventorySchema = new Schema<IInventoryItem>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ingredientName: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    expirationDate: {
      type: Date,
    },
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

inventorySchema.index({ user: 1, ingredientName: 1 }, { unique: true });
inventorySchema.index({ user: 1, expirationDate: 1 });

export const InventoryItem = mongoose.model<IInventoryItem>(
  "InventoryItem",
  inventorySchema
);
export default InventoryItem;
