import { createServerFileRoute } from "@tanstack/react-start/server";

import { getPdfFn } from "@/features/invoices/server/getPdfFn";

export const ServerRoute = createServerFileRoute(
  "/_protected/api/invoices/$id/pdf",
).methods({
  GET: async ({ params: { id } }) => {
    try {
      return getPdfFn({ data: { id } });
    } catch (e) {
      console.error(e);

      return { error: "Invoice not found" };
    }
  },
});
