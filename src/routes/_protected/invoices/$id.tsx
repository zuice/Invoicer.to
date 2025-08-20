import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Printer } from "lucide-react";

import { invoiceQueryOptions } from "@/features/invoices/server/getInvoiceFn";
import { InvoicePreview } from "@/features/invoices/components/InvoicePreview";
import { NotFound } from "@/components/NotFound";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/Heading";

export const Route = createFileRoute("/_protected/invoices/$id")({
  loader: ({ params: { id }, context }) => {
    context.queryClient.ensureQueryData(invoiceQueryOptions(id));
    return { id };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useLoaderData({ from: "/_protected/invoices/$id" });
  const {
    data: { invoice },
  } = useSuspenseQuery(invoiceQueryOptions(id));

  if (!invoice) {
    return <NotFound />;
  }

  return (
    <>
      <Heading
        title={`Invoice #${invoice.invoiceNumber}`}
        description={`Issued on ${invoice.date.toLocaleDateString()}`}
      />

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button asChild size="sm">
          <a
            href={`/api/invoices/${invoice.id}/pdf`}
            target="_blank"
            rel="noreferrer"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </a>
        </Button>
      </div>

      <InvoicePreview invoice={invoice} />
    </>
  );
}
