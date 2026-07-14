import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { paymentController } from "./payment.controller";
import { createPaymentValidationSchema } from "./payment.validation";

const router = Router();

router.post(
  "/create",
  auth(Role.CUSTOMER),
  validateRequest(createPaymentValidationSchema),
  paymentController.createPaymentSession,
);

router.get("/confirm", paymentController.confirmPayment);

router.get("/", auth(Role.CUSTOMER), paymentController.getCustomerPayments);

router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  paymentController.getPaymentById,
);

export const paymentRoutes = router;
