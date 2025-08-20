import { z } from "zod";

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

export const invoiceSchema = z.object({
  invoiceNumber: z.string(),
  date: z.date(),
  fromName: z.string().min(1, "Your name is required"),
  fromEmail: z.string().email("Invalid email"),
  fromStreet: z.string(),
  fromCity: z.string(),
  fromState: z.string(),
  fromPostal: z.string(),
  fromCountry: z.string(),
  toName: z.string().min(1, "Client name is required"),
  toEmail: z.string().email("Invalid client email"),
  toStreet: z.string(),
  toCity: z.string(),
  toState: z.string(),
  toPostal: z.string(),
  toCountry: z.string(),
  items: z.array(lineItemSchema).min(1, "At least one line item is required"),
});
