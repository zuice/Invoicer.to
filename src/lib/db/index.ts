import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/lib/env";
import * as schema from "@/lib/db/schema";

export const db = drizzle({
  schema,
  connection: {
    url: env.DB_FILE_NAME,
    authToken: env.TURSO_KEY,
  },
});
