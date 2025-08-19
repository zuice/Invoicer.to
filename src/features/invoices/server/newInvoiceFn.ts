import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

import { getSessionFromRequest } from "@/utils/getSessionFromRequest";
import { db } from "@/lib/db";
import { invoices, lineItems } from "@/lib/db/schema";
import { invoiceSchema } from "@/features/invoices/schemas";
import { mutationOptions } from "@tanstack/react-query";

export const newInvoiceFn = createServerFn({ method: "POST" })
  .validator(invoiceSchema)
  .handler(async ({ data }) => {
    const session = await getSessionFromRequest();
    const { id: userId } = session.user;

    const record = await db
      .insert(invoices)
      .values({
        ...data,
        userId,
        createdAt: new Date(),
      })
      .returning({ id: invoices.id });

    const invoice = record[0];
    const records = data.items.map((lineItem) =>
      db
        .insert(lineItems)
        .values({
          ...lineItem,
          invoiceId: invoice.id,
        })
        .execute(),
    );

    await Promise.all(records);

    return invoice;
  });

export function newInvoiceMutationOptions() {
  return mutationOptions({
    mutationKey: ["newInvoice"],
    mutationFn: (input: { data: z.infer<typeof invoiceSchema> }) =>
      newInvoiceFn(input),
  });
}
