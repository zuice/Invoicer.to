import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { generateInvoicePdf } from "@/features/invoices/utils/generateInvoicePdf";
import { getSessionFromRequest } from "@/utils/getSessionFromRequest";

export const getPdfFn = createServerFn({ method: "GET", response: "raw" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { user } = await getSessionFromRequest();
    const invoice = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, data.id), eq(invoices.userId, user.id)),
      with: { items: true },
    });

    if (!invoice) throw new Error("Invoice not found");

    const pdf = await generateInvoicePdf(invoice);

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoice-${invoice.id}.pdf"`,
      },
    });
  });
