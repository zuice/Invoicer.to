import { createServerFn } from "@tanstack/react-start";
import { setHeader } from "@tanstack/react-start/server";
import { eq, and, gt } from "drizzle-orm";
import { mutationOptions } from "@tanstack/react-query";
import { z } from "zod";

import { db } from "@/lib/db";
import { users, otps } from "@/lib/db/schema";
import { verifyOtpSchema } from "@/features/auth/schemas";
import { auth } from "@/lib/auth";

export const verifyOtpFn = createServerFn({ method: "POST" })
  .validator(verifyOtpSchema)
  .handler(async ({ data: { email, code } }) => {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) throw new Error("User not found");

    const [otp] = await db
      .select()
      .from(otps)
      .where(
        and(
          eq(otps.userId, user.id),
          eq(otps.code, code),
          gt(otps.expiresAt, new Date()),
        ),
      );

    if (!otp) throw new Error("Invalid or expired code");

    await db.delete(otps).where(eq(otps.userId, user.id));

    const session = await auth.createSession(user.id, {});
    const cookie = auth.createSessionCookie(session.id);

    setHeader("Set-Cookie", cookie.serialize());

    return { ok: true };
  });

export function getVerifyOtpMutationOptions() {
  return mutationOptions({
    mutationKey: ["verifyOtp"],
    mutationFn: (input: { data: z.infer<typeof verifyOtpSchema> }) =>
      verifyOtpFn(input),
  });
}
