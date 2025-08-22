import { createServerFn } from "@tanstack/react-start";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSessionFromRequest } from "@/utils/getSessionFromRequest";
import { eq } from "drizzle-orm";
import { queryOptions } from "@tanstack/react-query";

export const getMeFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionFromRequest();
  const [user] = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.id, session.user?.id))
    .execute();

  return user;
});

export function meQueryOptions() {
  return queryOptions({
    queryKey: ["getMe"],
    queryFn: () => getMeFn(),
  });
}
