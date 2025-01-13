import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(["CURRENT", "SAVINGS"]),
  balance: z.string().min(1, "Initial balance is required"),
  isDefault: z.boolean().default(false),
});
