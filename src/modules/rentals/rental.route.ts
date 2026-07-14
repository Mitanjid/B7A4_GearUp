import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { rentalController } from "./rental.controller";
import {
  createRentalValidationSchema,
  updateRentalStatusValidationSchema,
} from "./rental.validation";

const router = Router();

// Customer routes
router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(createRentalValidationSchema),
  rentalController.createRental,
);

router.get("/", auth(Role.CUSTOMER), rentalController.getCustomerRentals);

router.patch("/:id/cancel", auth(Role.CUSTOMER), rentalController.cancelRental);

// Provider routes
router.get(
  "/provider/orders",
  auth(Role.PROVIDER),
  rentalController.getProviderRentals,
);

router.patch(
  "/provider/:id",
  auth(Role.PROVIDER),
  validateRequest(updateRentalStatusValidationSchema),
  rentalController.updateRentalStatus,
);

// Shared (Customer + Provider, dynamic :id — সবার শেষে রাখো)
router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  rentalController.getRentalById,
);

export const rentalRoutes = router;
