import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/lib/env";
import * as schema from "@/lib/db/schema";

export const db = drizzle({
  schema,
  connection: {
    url: `file:${env.DB_FILE_NAME}`,
  },
});
