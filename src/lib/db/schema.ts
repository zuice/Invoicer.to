import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { addMinutes } from "date-fns";
import { randomInt } from "node:crypto";

// Users table
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().default("John Smith"),
  email: text("email").notNull().unique(),
});

export type User = InferSelectModel<typeof users>;

// Sessions table
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

// OTPs table
export const otps = sqliteTable("otps", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  code: text("code")
    .notNull()
    .$defaultFn(() => randomInt(100000, 999999).toString()),

  expiresAt: integer("expires_at", { mode: "timestamp" })
    .$defaultFn(() => addMinutes(new Date(), 10))
    .notNull(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Invoices table
export const invoices = sqliteTable("invoices", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  invoiceNumber: text("invoice_number"),
  date: integer("date", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  dueDate: integer("due_date", { mode: "timestamp" }),
  status: text("status", { enum: ["PENDING", "PAID", "OVERDUE"] })
    .default("PENDING")
    .notNull(),

  fromName: text("from_name").notNull(),
  fromEmail: text("from_email").notNull(),
  fromStreet: text("from_street"),
  fromCity: text("from_city"),
  fromState: text("from_state"),
  fromPostal: text("from_postal"),
  fromCountry: text("from_country"),

  toName: text("to_name").notNull(),
  toEmail: text("to_email").notNull(),
  toStreet: text("to_street"),
  toCity: text("to_city"),
  toState: text("to_state"),
  toPostal: text("to_postal"),
  toCountry: text("to_country"),

  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),

  archived: integer("archived", { mode: "boolean" }).default(false),
});

// Line items table
export const lineItems = sqliteTable("line_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  invoiceId: text("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),

  description: text("description").notNull(),
  details: text("details"),
  quantity: integer("quantity").notNull().default(1),
  price: real("price").notNull().default(0),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  invoices: many(invoices),
  sessions: many(sessions),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
  items: many(lineItems),
}));

export const lineItemsRelations = relations(lineItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [lineItems.invoiceId],
    references: [invoices.id],
  }),
}));
