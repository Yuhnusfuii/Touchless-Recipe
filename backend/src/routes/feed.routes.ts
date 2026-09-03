import { Router } from "express";
import { feedController } from "../controllers/feed.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/", (req, res, next) => feedController.getPosts(req, res, next));
router.post("/", (req, res, next) => feedController.createPost(req, res, next));

export default router;