import { z } from "zod";

export const createPaymentValidationSchema = z.object({
  body: z.object({
    rentalOrderId: z.uuid({ error: "Invalid rental order ID" }),
  }),
});
