import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { getSessionFromRequest } from "@/utils/getSessionFromRequest";

export const deleteInvoiceFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data: { id } }) => {
    const { user } = await getSessionFromRequest();

    await db
      .update(invoices)
      .set({ archived: true })
      .where(and(eq(invoices.id, id), eq(invoices.userId, user.id)))
      .execute();

    return true;
  });
