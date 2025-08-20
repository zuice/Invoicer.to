import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
    authToken: process.env.TURSO_KEY!,
  },
});
