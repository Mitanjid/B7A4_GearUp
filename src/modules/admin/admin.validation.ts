import { z } from "zod";

export const updateUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["ACTIVE", "SUSPENDED"], {
      error: "Status must be either ACTIVE or SUSPENDED",
    }),
  }),
});
