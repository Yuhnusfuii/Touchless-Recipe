import type { Request, Response, NextFunction } from "express";
import { inventoryService } from "../services/inventory.service.js";

export class InventoryController {
  async getInventoryByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId || typeof userId !== "string") {
        res.status(400).json({ success: false, message: "Valid User ID is required" });
        return;
      }
      const items = await inventoryService.getInventoryByUser(userId);
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  }

  async addInventoryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await inventoryService.addInventoryItem(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async updateInventoryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        res.status(400).json({ success: false, message: "Valid Item ID is required" });
        return;
      }
      const item = await inventoryService.updateInventoryItem(id, req.body);
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async deleteInventoryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        res.status(400).json({ success: false, message: "Valid Item ID is required" });
        return;
      }
      await inventoryService.deleteInventoryItem(id);
      res.status(200).json({ success: true, message: "Inventory item deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();
