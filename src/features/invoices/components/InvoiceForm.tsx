import { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Plus, X } from "lucide-react";

import { useAppForm } from "@/features/forms/hooks/useAppForm";
import { Button } from "@/components/ui/button";
import { invoiceSchema, paymentTermsSchema } from "@/features/invoices/schemas";
import { PAYMENT_TERMS } from "@/features/invoices/constants";
import { newInvoiceMutationOptions } from "@/features/invoices/server/newInvoiceFn";

export function InvoiceForm() {
  const navigate = useNavigate();
  const form = useAppForm({
    defaultValues: {
      invoiceNumber: "",
      date: new Date(),
      paymentTerms: "DUE_ON_RECEIPT" as z.infer<typeof paymentTermsSchema>,
      toName: "",
      toEmail: "",
      toStreet: "",
      toCity: "",
      toState: "",
      toPostal: "",
      toCountry: "",
      items: [{ description: "", details: "", quantity: 1, price: 0 }],
    },
    validators: { onBlur: invoiceSchema },
    onSubmit: async ({ value }) => {
      mutate({ data: value });
    },
  });

  const { mutate } = useMutation({
    ...newInvoiceMutationOptions(),
    onSuccess: () => {
      toast.success("Invoice saved.");
      form.reset();
      setTimeout(() => navigate({ to: "/invoices" }), 250);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save invoice");
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
        <div className="w-full md:max-w-2xl lg:max-w-5xl">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
            <div className="space-y-5">
              {/* Header */}
              <section className="rounded-lg border bg-white p-4 shadow-sm md:p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <form.AppField name="invoiceNumber">
                    {(f) => (
                      <f.TextField label="Invoice #" placeholder="INV-1024" />
                    )}
                  </form.AppField>
                  <form.AppField name="date">
                    {(f) => <f.TextField label="Date" type="date" />}
                  </form.AppField>
                  <form.AppField name="paymentTerms">
                    {(f) => (
                      <f.SelectField
                        label="Payment Terms"
                        options={PAYMENT_TERMS.map((term) => ({
                          label: term
                            .split("_")
                            .map((w) => w[0] + w.slice(1).toLowerCase())
                            .join(" "),
                          value: term,
                        }))}
                      />
                    )}
                  </form.AppField>
                </div>
              </section>
              <section className="rounded-lg border bg-white p-4 shadow-sm md:p-5">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Bill To
                </h2>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <form.AppField name="toName">
                    {(f) => (
                      <f.TextField
                        label="Client Name"
                        placeholder="Client Co."
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="toEmail">
                    {(f) => (
                      <f.TextField
                        label="Client Email"
                        type="email"
                        inputMode="email"
                        placeholder="client@company.com"
                      />
                    )}
                  </form.AppField>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <form.AppField name="toStreet">
                    {(f) => (
                      <f.TextField label="Street" placeholder="123 Client St" />
                    )}
                  </form.AppField>
                  <form.AppField name="toCity">
                    {(f) => <f.TextField label="City" />}
                  </form.AppField>
                  <form.AppField name="toState">
                    {(f) => <f.TextField label="State / Province" />}
                  </form.AppField>
                  <form.AppField name="toPostal">
                    {(f) => (
                      <f.TextField label="Postal Code" inputMode="numeric" />
                    )}
                  </form.AppField>
                  <form.AppField name="toCountry">
                    {(f) => <f.TextField label="Country" />}
                  </form.AppField>
                </div>
              </section>

              {/* Items */}
              <section className="rounded-lg border bg-white p-4 shadow-sm md:p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-muted-foreground">
                    Items
                  </h2>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      form.setFieldValue("items", [
                        ...form.getFieldValue("items"),
                        { description: "", details: "", quantity: 1, price: 0 },
                      ])
                    }
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add item
                  </Button>
                </div>

                <form.Field name="items" mode="array">
                  {(field) => (
                    <div className="mt-3 space-y-3 md:mt-4 md:space-y-4">
                      {field.state.value.map((_, i) => (
                        <div
                          key={i}
                          className="rounded-md border p-3 shadow-sm md:p-4"
                        >
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
                            <div className="md:col-span-6">
                              <form.AppField name={`items[${i}].description`}>
                                {(f) => (
                                  <f.TextField
                                    label="Description"
                                    placeholder="Service or product"
                                  />
                                )}
                              </form.AppField>
                            </div>

                            <div className="md:col-span-2">
                              <form.AppField name={`items[${i}].quantity`}>
                                {(f) => (
                                  <f.TextField
                                    label="Qty"
                                    type="number"
                                    inputMode="decimal"
                                    step="1"
                                    min="0"
                                    className="[&>input]:text-right"
                                  />
                                )}
                              </form.AppField>
                            </div>

                            <div className="md:col-span-3">
                              <form.AppField name={`items[${i}].price`}>
                                {(f) => (
                                  <f.TextField
                                    label="Price"
                                    type="number"
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0"
                                    className="[&>input]:text-right"
                                  />
                                )}
                              </form.AppField>
                            </div>

                            <div className="flex items-end justify-between md:col-span-1 md:block">
                              <button
                                type="button"
                                aria-label="Remove item"
                                className="text-muted-foreground hover:text-foreground md:mt-[26px]"
                                onClick={() => {
                                  const next = field.state.value.slice();
                                  next.splice(i, 1);
                                  field.handleChange(next);
                                }}
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>

                            <div className="md:col-span-12">
                              <form.AppField name={`items[${i}].details`}>
                                {(f) => (
                                  <f.TextField
                                    label="Details (optional)"
                                    placeholder="Add notes"
                                  />
                                )}
                              </form.AppField>
                            </div>

                            <div className="md:col-span-12 text-right text-sm font-medium">
                              <form.Subscribe
                                selector={(s) => s.values.items[i]}
                              >
                                {(item) => (
                                  <span>
                                    Item total: $
                                    {(
                                      Number(item.quantity) *
                                        Number(item.price) || 0
                                    ).toFixed(2)}
                                  </span>
                                )}
                              </form.Subscribe>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </form.Field>
              </section>

              <form.Subscribe selector={(s) => s.values}>
                {(values) => {
                  const subtotal = values.items.reduce(
                    (sum, item) =>
                      sum +
                      Number(item.quantity || 0) * Number(item.price || 0),
                    0,
                  );
                  const total = subtotal;
                  return (
                    <section className="rounded-lg border bg-white p-4 shadow-sm md:p-5 lg:hidden">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-base font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </section>
                  );
                }}
              </form.Subscribe>

              <div className="h-20 lg:h-0" />
            </div>

            <div className="hidden lg:block">
              <form.Subscribe selector={(s) => s.values}>
                {(values) => {
                  const subtotal = values.items.reduce(
                    (sum, item) =>
                      sum +
                      Number(item.quantity || 0) * Number(item.price || 0),
                    0,
                  );
                  const total = subtotal;
                  return (
                    <aside className="flex flex-col gap-2 sticky top-4 rounded-lg border bg-white p-4 shadow-sm">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Summary
                      </h3>
                      <div className="mt-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-base font-semibold">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                      <form.SubmitButton label="Save Invoice" />
                    </aside>
                  );
                }}
              </form.Subscribe>
            </div>
          </div>
        </div>

        <form.Subscribe selector={(s) => s.values}>
          {(values) => {
            const total = values.items.reduce(
              (sum, item) =>
                sum + Number(item.quantity || 0) * Number(item.price || 0),
              0,
            );
            return (
              <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 lg:hidden">
                <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 p-3">
                  <div className="text-sm">
                    <div className="text-muted-foreground">Total</div>
                    <div className="text-lg font-semibold">
                      ${total.toFixed(2)}
                    </div>
                  </div>
                  <form.SubmitButton label="Save Invoice" />
                </div>
              </div>
            );
          }}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
