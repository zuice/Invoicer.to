import { invoices, lineItems } from "@/lib/db/schema";

import { InvoiceRaw } from "@/features/invoices/components/InvoiceRaw";

type InvoiceWithItems = typeof invoices.$inferSelect & {
  items: (typeof lineItems.$inferSelect)[];
};

interface Props {
  invoice: InvoiceWithItems;
}

export function InvoicePreview({ invoice }: Props) {
  return (
    <div className="max-w-4xl flex flex-col gap-4 bg-white shadow-sm rounded-lg border p-6">
      <InvoiceRaw invoice={invoice} />
    </div>
  );
}
