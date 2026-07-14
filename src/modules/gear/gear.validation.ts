import { z } from "zod";

export const createGearValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Gear name is required" })
      .min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    brand: z.string().optional(),
    pricePerDay: z
      .number({ error: "Price per day is required" })
      .positive("Price must be greater than 0"),
    stock: z.number().int().min(0).optional(),
    isAvailable: z.boolean().optional(),
    imageUrl: z.string().url("Invalid image URL").optional(),
    categoryId: z
      .string({ error: "Category is required" })
      .uuid("Invalid category ID"),
  }),
});

export const updateGearValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    brand: z.string().optional(),
    pricePerDay: z.number().positive().optional(),
    stock: z.number().int().min(0).optional(),
    isAvailable: z.boolean().optional(),
    imageUrl: z.string().url().optional(),
    categoryId: z.string().uuid().optional(),
  }),
});
