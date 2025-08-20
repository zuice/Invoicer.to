import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Eye, Download, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { invoicesQueryOptions } from "@/features/invoices/server/getInvoicesFn";
import { deleteInvoiceFn } from "@/features/invoices/server/deleteInvoiceFn";

export const Route = createFileRoute("/_protected/invoices/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(invoicesQueryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data: invoices } = useSuspenseQuery(invoicesQueryOptions());

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const handleDelete = async (id: string) => {
    await deleteInvoiceFn({ data: { id } });
    queryClient.invalidateQueries(invoicesQueryOptions());
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Manage and track all your invoices in one place.
          </p>
        </div>
        <Button asChild>
          <Link to="/invoices/new">+ New Invoice</Link>
        </Button>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>
            A list of all invoices you’ve created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const total = invoice.items.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0,
                  );

                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{formatDate(invoice.date)}</TableCell>
                      <TableCell>{invoice.fromName}</TableCell>
                      <TableCell>{invoice.toName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.status === "PAID"
                              ? "success"
                              : invoice.status === "OVERDUE"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {invoice.status?.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(total)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link to="/invoices/$id" params={{ id: invoice.id }}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="secondary" size="icon" asChild>
                          <a
                            href={`/api/invoices/${invoice.id}/pdf`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={async () => await handleDelete(invoice.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">No invoices yet</p>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first invoice.
              </p>
              <Button asChild>
                <Link to="/invoices/new">+ New Invoice</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
