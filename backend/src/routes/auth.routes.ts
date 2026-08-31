import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  validateLogin,
  validateRegister,
} from "../middlewares/validateAuth.middleware.js";

const router = Router();

router.post("/register", validateRegister, (req, res, next) =>
  authController.register(req, res, next)
);

router.post("/login", validateLogin, (req, res, next) =>
  authController.login(req, res, next)
);

router.post("/sso", (req, res, next) =>
  authController.loginOrRegister(req, res, next)
);

router.get("/me", protect, (req, res, next) =>
  authController.getMe(req, res, next)
);

export default router;
