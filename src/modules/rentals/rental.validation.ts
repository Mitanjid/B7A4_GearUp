import { z } from "zod";

export const createRentalValidationSchema = z.object({
  body: z
    .object({
      gearItemId: z.uuid({ error: "Invalid gear item ID" }),
      startDate: z.iso.datetime({ error: "Invalid start date format" }),
      endDate: z.iso.datetime({ error: "Invalid end date format" }),
    })
    .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
      message: "End date must be after start date",
      path: ["endDate"],
    }),
});

export const updateRentalStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["CONFIRMED", "PICKED_UP", "RETURNED", "CANCELLED"], {
      error: "Valid status is required",
    }),
  }),
});
