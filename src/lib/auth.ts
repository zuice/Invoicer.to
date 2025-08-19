import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

import { db } from "@/lib/db";
import { users, sessions } from "@/lib/db/schema";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export type Auth = typeof auth;
