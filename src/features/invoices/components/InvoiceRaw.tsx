import { invoices, lineItems } from "@/lib/db/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type InvoiceWithItems = typeof invoices.$inferSelect & {
  items: (typeof lineItems.$inferSelect)[];
};

interface Props {
  invoice: InvoiceWithItems;
}

export function InvoiceRaw({ invoice }: Props) {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const total = subtotal;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">{invoice.fromName}</h2>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            {invoice.fromStreet && <p>{invoice.fromStreet}</p>}
            <p>
              {[invoice.fromCity, invoice.fromState, invoice.fromPostal]
                .filter(Boolean)
                .join(", ")}
            </p>
            {invoice.fromCountry && <p>{invoice.fromCountry}</p>}
            <p>{invoice.fromEmail}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-right">
          <p className="uppercase text-sm font-semibold">Invoice</p>
          {invoice.invoiceNumber && (
            <p className="font-medium">#{invoice.invoiceNumber}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Date: {invoice.date.toLocaleDateString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Due by: {invoice.paymentTerms}
          </p>
          <p className="font-bold text-lg">Balance Due: ${total.toFixed(2)}</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="flex flex-col gap-2 border-b pb-6">
        <h3 className="font-semibold text-lg">Bill To</h3>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p className="font-medium text-black">{invoice.toName}</p>
          {invoice.toStreet && <p>{invoice.toStreet}</p>}
          <p>
            {[invoice.toCity, invoice.toState, invoice.toPostal]
              .filter(Boolean)
              .join(", ")}
          </p>
          {invoice.toCountry && <p>{invoice.toCountry}</p>}
          <p>{invoice.toEmail}</p>
        </div>
      </div>

      {/* Line Items */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item, i) => (
              <TableRow
                key={item.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                <TableCell className="font-medium">
                  {item.description}
                  {item.details && (
                    <p className="text-xs text-muted-foreground">
                      {item.details}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  ${item.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${(item.quantity * item.price).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 flex flex-col gap-2 text-right">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
