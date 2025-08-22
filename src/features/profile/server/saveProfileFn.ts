import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { profileSchema } from "@/features/profile/schemas";
import { getSessionFromRequest } from "@/utils/getSessionFromRequest";

export const saveProfileFn = createServerFn({ method: "POST" })
  .validator(profileSchema)
  .handler(
    async ({
      data: { name, phone, street, city, state, postalCode, country },
    }) => {
      const session = await getSessionFromRequest();
      if (!session) {
        throw new Error("Unauthorized");
      }

      await db
        .update(users)
        .set({
          name,
          phone: phone || null,
          street,
          city,
          state: state || null,
          postalCode,
          country,
          active: true,
        })
        .where(eq(users.id, session.user.id));

      return { ok: true };
    },
  );
