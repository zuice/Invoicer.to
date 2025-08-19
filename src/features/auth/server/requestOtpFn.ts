import nodemailer from "nodemailer";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { randomInt } from "crypto";
import { eq } from "drizzle-orm";
import { mutationOptions } from "@tanstack/react-query";

import { env } from "@/lib/env";
import { db } from "@/lib/db";
import { users, otps } from "@/lib/db/schema";
import { emailSchema } from "@/features/auth/schemas";

// Ethereal test account
const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: 587,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export const requestOtpFn = createServerFn({ method: "POST" })
  .validator(z.object({ email: emailSchema }))
  .handler(async ({ data: { email } }) => {
    let [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      [user] = await db
        .insert(users)
        .values({ id: crypto.randomUUID(), email })
        .returning();
    }

    const code = String(randomInt(100000, 999999));

    await db.insert(otps).values({
      id: crypto.randomUUID(),
      userId: user.id,
      code,
    });

    const info = await transporter.sendMail({
      from: '"Invoicer" <no-reply@invoicer.to>',
      to: email,
      subject: "Your login code",
      text: `Your one-time code is ${code}`,
    });

    console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
    return { ok: true };
  });

export function getRequestOtpMutationOptions() {
  return mutationOptions({
    mutationKey: ["requestOtp"],
    mutationFn: (input: { data: { email: string } }) => requestOtpFn(input),
  });
}
