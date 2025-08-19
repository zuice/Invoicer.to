import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/router-core";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const getAuthFn = createServerFn({ method: "GET" }).handler(async () => {
  const request = getWebRequest();
  const cookieHeader = request.headers.get("Cookie");
  const sessionId = auth.readSessionCookie(cookieHeader ?? "");
  const session = await auth.validateSession(sessionId ?? "");

  if (!session?.user) {
    throw redirect({ to: "/auth/sign-in" });
  }

  const { id } = session.user;

  const user = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.id, id));

  return { user: user[0] };
});
