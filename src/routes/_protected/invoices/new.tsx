import { createFileRoute } from "@tanstack/react-router";

import { InvoiceForm } from "@/features/invoices/components/InvoiceForm";
import { Heading } from "@/components/Heading";

export const Route = createFileRoute("/_protected/invoices/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Heading
        title="New Invoice"
        description="Create an invoice to send out today."
      />
      <InvoiceForm />
    </>
  );
}
