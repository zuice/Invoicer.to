import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { mutationOptions } from "@tanstack/react-query";

import { db } from "@/lib/db";
import { invoices, lineItems } from "@/lib/db/schema";
import { invoiceSchema } from "@/features/invoices/schemas";
import { getProfileFn } from "@/features/profile/server/getProfileFn";
import { getSessionFromRequest } from "@/utils/getSessionFromRequest";

export const newInvoiceFn = createServerFn({ method: "POST" })
  .validator(invoiceSchema)
  .handler(async ({ data }) => {
    const session = await getSessionFromRequest();
    const user = await getProfileFn();

    if (!user) {
      throw new Error("User not found");
    }

    const fromPayload = {
      fromName: user.name ?? "",
      fromEmail: user.email ?? "",
      fromStreet: user.street ?? "",
      fromCity: user.city ?? "",
      fromState: user.state ?? "",
      fromPostal: user.postalCode ?? "",
      fromCountry: user.country ?? "",
    };

    const insertPayload = {
      ...data,
      ...fromPayload,
      userId: session.user.id,
    };

    const [inserted] = await db
      .insert(invoices)
      .values(insertPayload)
      .returning({ id: invoices.id });

    await Promise.all(
      data.items.map((li) =>
        db
          .insert(lineItems)
          .values({
            invoiceId: inserted.id,
            description: li.description,
            details: li.details,
            quantity: li.quantity,
            price: li.price,
          })
          .execute(),
      ),
    );

    return inserted;
  });

export function newInvoiceMutationOptions() {
  return mutationOptions({
    mutationKey: ["newInvoice"],
    mutationFn: (input: { data: z.infer<typeof invoiceSchema> }) =>
      newInvoiceFn(input),
  });
}
