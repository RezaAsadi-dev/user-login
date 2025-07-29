import { z } from "zod";

export const authSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^09\d{9}$/, "Phone number must be 11 digits starting with 09")
    .length(11, "Phone number must be exactly 11 digits"),
});

export type AuthFormData = z.infer<typeof authSchema>;
