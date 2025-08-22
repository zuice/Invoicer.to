import { z } from "zod";

import { PAYMENT_TERMS } from "@/features/invoices/constants";

export const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  details: z.string(),
  quantity: z.coerce
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(1, "Quantity must be at least 1"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price must be 0 or greater"),
});

export const paymentTermsSchema = z.enum(PAYMENT_TERMS);

export const invoiceSchema = z.object({
  invoiceNumber: z.string(),
  date: z.coerce.date(),
  paymentTerms: paymentTermsSchema,
  toName: z.string().min(1, "Field is required"),
  toEmail: z.string().email("Invalid client email"),
  toStreet: z.string().min(1, "Field is required"),
  toCity: z.string().min(1, "Field is required"),
  toState: z.string().min(1, "Field is required"),
  toPostal: z.coerce
    .string()
    .max(5, "Postal code must be 5 characters")
    .min(5, "Postal code must be 5 characters"),
  toCountry: z.string().min(1, "Field is required"),
  items: z.array(lineItemSchema).min(1, "At least one line item is required"),
});
