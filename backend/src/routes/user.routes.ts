import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

const router = Router();

router.get("/", (req, res, next) => userController.getAllUsers(req, res, next));
router.get("/:id", (req, res, next) => userController.getUserById(req, res, next));
router.post("/", (req, res, next) => userController.createUser(req, res, next));
router.put("/:id", (req, res, next) => userController.updateUser(req, res, next));
router.post("/:id/cooking-progress", (req, res, next) =>
  userController.recordCookingProgress(req, res, next)
);
router.delete("/:id", (req, res, next) => userController.deleteUser(req, res, next));

export default router;
