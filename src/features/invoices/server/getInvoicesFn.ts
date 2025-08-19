import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";

import { getSessionFromRequest } from "@/utils/getSessionFromRequest";
import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";

export const getInvoicesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await getSessionFromRequest();
    const { id: userId } = session.user;

    const records = db.query.invoices.findMany({
      where: and(eq(invoices.userId, userId), eq(invoices.archived, false)),
      with: { items: true },
    });

    return records;
  },
);

export function invoicesQueryOptions() {
  return queryOptions({
    queryKey: ["invoices"],
    queryFn: () => getInvoicesFn(),
  });
}
