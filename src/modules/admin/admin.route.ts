import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminController } from "./admin.controller";
import { updateUserStatusValidationSchema } from "./admin.validation";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);

router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  validateRequest(updateUserStatusValidationSchema),
  adminController.updateUserStatus,
);

router.get("/gear", auth(Role.ADMIN), adminController.getAllGear);

router.get("/rentals", auth(Role.ADMIN), adminController.getAllRentals);

export const adminRoutes = router;
