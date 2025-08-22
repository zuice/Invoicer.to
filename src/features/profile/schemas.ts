import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(7, "Phone seems too short")
    .max(20, "Phone seems too long")
    .or(z.literal("")),
  street: z.string().min(3, "Street is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().or(z.literal("")),
  postalCode: z
    .string()
    .min(3, "Postal code is required")
    .max(12, "Postal code is too long"),
  country: z.string().min(2, "Country is required"),
});
