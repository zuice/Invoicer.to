import { createFileRoute } from "@tanstack/react-router";

import { InvoiceForm } from "@/features/invoices/components/InvoiceForm";

export const Route = createFileRoute("/_protected/invoices/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex gap-8 p-6">
      <InvoiceForm />
    </div>
  );
}
