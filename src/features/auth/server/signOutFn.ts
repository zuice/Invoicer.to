import { getWebRequest, setCookie } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";

import { auth } from "@/lib/auth";

export const signOutFn = createServerFn({
  method: "POST",
  response: "full",
}).handler(async () => {
  const request = getWebRequest();
  const cookieHeader = request.headers.get("Cookie");
  const sessionId = auth.readSessionCookie(cookieHeader ?? "");
  const session = await auth.validateSession(sessionId ?? "");

  if (session) {
    await auth.invalidateSession(session?.session?.id ?? "");
  }

  setCookie("Set-Cookie", auth.createBlankSessionCookie().serialize());

  return {
    success: true,
  };
});
