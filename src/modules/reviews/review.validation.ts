import { z } from "zod";

export const createReviewValidationSchema = z.object({
  body: z.object({
    rentalOrderId: z.uuid({ error: "Invalid rental order ID" }),
    rating: z
      .number({ error: "Rating is required" })
      .int("Rating must be a whole number")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),
    comment: z.string().optional(),
  }),
});
