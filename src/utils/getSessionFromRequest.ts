import { getWebRequest } from "@tanstack/react-start/server";

import { auth } from "@/lib/auth";

export async function getSessionFromRequest() {
  const request = getWebRequest();
  const cookieHeader = request.headers.get("Cookie");
  const sessionId = auth.readSessionCookie(cookieHeader ?? "");
  const session = await auth.validateSession(sessionId ?? "");

  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }

  return session;
}
