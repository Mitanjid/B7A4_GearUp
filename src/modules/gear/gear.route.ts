import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { gearController } from "./gear.controller";
import {
  createGearValidationSchema,
  updateGearValidationSchema,
} from "./gear.validation";

const router = Router();

// Public routes
router.get("/", gearController.getAllGear);
router.get("/:id", gearController.getGearById);

// Provider-only routes
router.get(
  "/provider/my-gear",
  auth(Role.PROVIDER),
  gearController.getProviderGear,
);

router.post(
  "/provider",
  auth(Role.PROVIDER),
  validateRequest(createGearValidationSchema),
  gearController.createGear,
);

router.patch(
  "/provider/:id",
  auth(Role.PROVIDER),
  validateRequest(updateGearValidationSchema),
  gearController.updateGear,
);

router.delete("/provider/:id", auth(Role.PROVIDER), gearController.deleteGear);

export const gearRoutes = router;
