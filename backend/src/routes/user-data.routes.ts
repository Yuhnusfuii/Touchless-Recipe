import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { userDataController } from "../controllers/user-data.controller.js";

const router = Router();
router.use(protect);
router.get("/favorites", (req, res, next) => userDataController.favorites(req, res, next));
router.post("/favorites/toggle", (req, res, next) => userDataController.toggleFavorite(req, res, next));
router.get("/notifications", (req, res, next) => userDataController.notifications(req, res, next));
router.post("/notifications/read", (req, res, next) => userDataController.markNotificationsRead(req, res, next));
router.get("/cooking-progress", (req, res, next) => userDataController.progress(req, res, next));
router.put("/cooking-progress", (req, res, next) => userDataController.saveProgress(req, res, next));
router.delete("/cooking-progress", (req, res, next) => userDataController.clearProgress(req, res, next));
export default router;