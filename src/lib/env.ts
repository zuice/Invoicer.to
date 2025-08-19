import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().min(1024).max(65535).default(3000),
  DB_FILE_NAME: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
});

export const env = envSchema.parse(process.env);
