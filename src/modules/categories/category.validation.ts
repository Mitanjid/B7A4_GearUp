import { z } from "zod";

export const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Category name is required" })
      .min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
  }),
});

export const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
  }),
});
