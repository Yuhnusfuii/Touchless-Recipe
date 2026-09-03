import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { friendsController } from "../controllers/friends.controller.js";

const router = Router();

router.use(protect);
router.get("/", (req, res, next) => friendsController.getSnapshot(req, res, next));
router.post("/requests", (req, res, next) => friendsController.sendRequest(req, res, next));
router.patch("/requests/:id", (req, res, next) => friendsController.updateRequest(req, res, next));

export default router;
