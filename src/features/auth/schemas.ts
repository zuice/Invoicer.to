import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "Email must be at least 5 characters long")
  .max(254, "Email must be less than 255 characters")
  .email("Invalid email address");

export const verifyOtpSchema = z.object({
  email: emailSchema,
  code: z.string().min(6).max(60),
});
