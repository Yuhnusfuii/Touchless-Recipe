import InventoryItem, {
  CreateInventoryItemDTO,
  UpdateInventoryItemDTO,
} from "../models/inventory.model.js";

export class InventoryService {
  async getInventoryByUser(userId: string) {
    return InventoryItem.find({ user: userId }).sort({ updatedAt: -1 });
  }

  async addInventoryItem(data: CreateInventoryItemDTO) {
    const expiration = data.expirationDate
      ? new Date(data.expirationDate)
      : undefined;

    return InventoryItem.findOneAndUpdate(
      {
        user: data.userId,
        ingredientName: data.ingredientName.trim().toLowerCase(),
      },
      {
        $set: {
          unit: data.unit,
          expirationDate: expiration,
        },
        $inc: {
          quantity: data.quantity,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  async updateInventoryItem(id: string, data: UpdateInventoryItemDTO) {
    const updateData: Record<string, unknown> = {};

    if (data.quantity !== undefined) {
      updateData["quantity"] = data.quantity;
    }

    if (data.expirationDate !== undefined) {
      updateData["expirationDate"] = data.expirationDate
        ? new Date(data.expirationDate)
        : null;
    }

    return InventoryItem.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
  }

  async deleteInventoryItem(id: string) {
    return InventoryItem.findByIdAndDelete(id);
  }
}

export const inventoryService = new InventoryService();

