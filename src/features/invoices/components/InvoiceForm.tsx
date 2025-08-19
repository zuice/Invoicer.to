import { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useInvoiceForm } from "@/features/invoices/hooks/useInvoiceForm";
import { newInvoiceMutationOptions } from "@/features/invoices/server/newInvoiceFn";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { invoiceSchema } from "@/features/invoices/schemas";

export function InvoiceForm() {
  const form = useInvoiceForm({
    defaultValues: {
      invoiceNumber: "",
      date: new Date(),
      fromName: "",
      fromEmail: "",
      fromStreet: "",
      fromCity: "",
      fromState: "",
      fromPostal: "",
      fromCountry: "",
      toName: "",
      toEmail: "",
      toStreet: "",
      toCity: "",
      toState: "",
      toPostal: "",
      toCountry: "",
      items: [{ description: "", details: "", quantity: 1, price: 0 }],
      taxRate: 0.07,
    },
    validators: {
      onChange: invoiceSchema,
    },
    onSubmit: async ({ value: data }) => {
      mutate({ data });
    },
  });

  const { mutate } = useMutation({
    ...newInvoiceMutationOptions(),
    onSuccess: () => {
      toast.success("Your invoice has been saved.");
      form.reset();
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    form.handleSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <form.AppForm>
        <div className="max-w-4xl bg-white p-8 border shadow mx-auto space-y-8 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Invoice</h1>
              <form.AppField name="invoiceNumber">
                {(f) => (
                  <div className="mt-2">
                    <f.TextField label="Invoice #" />
                  </div>
                )}
              </form.AppField>
            </div>
            <form.AppField name="date">
              {(f) => (
                <div>
                  <f.TextField label="Date" />
                </div>
              )}
            </form.AppField>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold mb-2">From</h3>
              <form.AppField name="fromName">
                {(f) => <f.TextField label="Name" />}
              </form.AppField>
              <form.AppField name="fromEmail">
                {(f) => <f.TextField label="Email" />}
              </form.AppField>
              <form.AppField name="fromStreet">
                {(f) => <f.TextField label="Street" />}
              </form.AppField>
              <div className="grid grid-cols-2 gap-2">
                <form.AppField name="fromCity">
                  {(f) => <f.TextField label="City" />}
                </form.AppField>
                <form.AppField name="fromState">
                  {(f) => <f.TextField label="State" />}
                </form.AppField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <form.AppField name="fromPostal">
                  {(f) => <f.TextField label="Postal" />}
                </form.AppField>
                <form.AppField name="fromCountry">
                  {(f) => <f.TextField label="Country" />}
                </form.AppField>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold mb-2">To</h3>
              <form.AppField name="toName">
                {(f) => <f.TextField label="Name" />}
              </form.AppField>
              <form.AppField name="toEmail">
                {(f) => <f.TextField label="Email" />}
              </form.AppField>
              <form.AppField name="toStreet">
                {(f) => <f.TextField label="Street" />}
              </form.AppField>
              <div className="grid grid-cols-2 gap-2">
                <form.AppField name="toCity">
                  {(f) => <f.TextField label="City" />}
                </form.AppField>
                <form.AppField name="toState">
                  {(f) => <f.TextField label="State" />}
                </form.AppField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <form.AppField name="toPostal">
                  {(f) => <f.TextField label="Postal" />}
                </form.AppField>
                <form.AppField name="toCountry">
                  {(f) => <f.TextField label="Country" />}
                </form.AppField>
              </div>
            </div>
          </div>

          <form.Field name="items" mode="array">
            {(field) => (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {field.state.value.map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <form.AppField name={`items[${i}].description`}>
                            {(f) => <f.TextField label="Description" />}
                          </form.AppField>
                        </TableCell>
                        <TableCell>
                          <form.AppField name={`items[${i}].details`}>
                            {(f) => <f.TextField label="Details" />}
                          </form.AppField>
                        </TableCell>
                        <TableCell className="text-center">
                          <form.AppField name={`items[${i}].quantity`}>
                            {(f) => <f.TextField label="Quantity" />}
                          </form.AppField>
                        </TableCell>
                        <TableCell className="text-right">
                          <form.AppField name={`items[${i}].price`}>
                            {(f) => <f.TextField label="Price" />}
                          </form.AppField>
                        </TableCell>
                        <TableCell className="text-right">
                          {/* Derived total */}

                          <form.Subscribe selector={(s) => s.values.items[i]}>
                            {(item) => (
                              <span>
                                ${(item.quantity * item.price).toFixed(2)}
                              </span>
                            )}
                          </form.Subscribe>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2"
                  onClick={() =>
                    field.handleChange([
                      ...field.state.value,
                      { description: "", details: "", quantity: 1, price: 0 },
                    ])
                  }
                >
                  + Add Item
                </Button>
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(s) => s.values}>
            {(values) => {
              const subtotal = values.items.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0,
              );
              const tax = subtotal * values.taxRate;
              const total = subtotal + tax;

              return (
                <div className="text-right space-y-1">
                  <p>Subtotal: ${subtotal.toFixed(2)}</p>
                  <p>
                    Tax ({(values.taxRate * 100).toFixed(0)}%): $
                    {tax.toFixed(2)}
                  </p>
                  <p className="font-bold text-lg">
                    Total: ${total.toFixed(2)}
                  </p>
                </div>
              );
            }}
          </form.Subscribe>

          {/* Submit */}
          <form.SubmitButton label="Save Invoice" />
        </div>
      </form.AppForm>
    </form>
  );
}
