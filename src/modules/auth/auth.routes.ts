import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { authController } from "./auth.controller";
import {
  registerValidationSchema,
  loginValidationSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerValidationSchema),
  authController.registerUser,
);
router.post(
  "/login",
  validateRequest(loginValidationSchema),
  authController.loginUser,
);
router.get("/me", auth(), authController.getMe);

export const authRoutes = router;
