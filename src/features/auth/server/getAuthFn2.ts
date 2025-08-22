import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/router-core";

import { getSessionFromRequest } from "@/utils/getSessionFromRequest";

export const getAuthFn2 = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await getSessionFromRequest();

    if (!session.user) {
      throw redirect({ to: "/auth/sign-in" });
    }

    return { user: session.user };
  },
);
