import { Router } from "express";
import { inventoryController } from "../controllers/inventory.controller.js";

const router = Router();

router.get("/user/:userId", (req, res, next) =>
  inventoryController.getInventoryByUser(req, res, next)
);
router.post("/", (req, res, next) =>
  inventoryController.addInventoryItem(req, res, next)
);
router.put("/:id", (req, res, next) =>
  inventoryController.updateInventoryItem(req, res, next)
);
router.delete("/:id", (req, res, next) =>
  inventoryController.deleteInventoryItem(req, res, next)
);

export default router;
