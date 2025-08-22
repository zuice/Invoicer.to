import { createServerFn } from "@tanstack/react-start";

import { db } from "@/lib/db";
import { getSessionFromRequest } from "@/utils/getSessionFromRequest";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { queryOptions } from "@tanstack/react-query";

export const getProfileFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await getSessionFromRequest();
    const [user] = await db
      .select({
        name: users.name,
        email: users.email,
        phone: users.phone,
        street: users.street,
        city: users.city,
        state: users.state,
        postalCode: users.postalCode,
        country: users.country,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .execute();

    return user;
  },
);

export function profileQueryOptions() {
  return queryOptions({
    queryKey: ["getProfile"],
    queryFn: () => getProfileFn(),
  });
}
