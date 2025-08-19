import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { queryOptions } from "@tanstack/react-query";

import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { getSessionFromRequest } from "@/utils/getSessionFromRequest";

export const getInvoiceFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data: { id } }) => {
    const session = await getSessionFromRequest();
    const record = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, id), eq(invoices.userId, session.user.id)),
      with: {
        items: true,
      },
    });

    return { invoice: record };
  });

export function invoiceQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["getInvoice", id],
    queryFn: () => getInvoiceFn({ data: { id } }),
  });
}
