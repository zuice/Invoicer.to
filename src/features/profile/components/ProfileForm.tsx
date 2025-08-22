import { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { useAppForm } from "@/features/forms/hooks/useAppForm";
import { Button } from "@/components/ui/button";
import { saveProfileFn } from "@/features/profile/server/saveProfileFn";
import { profileSchema } from "@/features/profile/schemas";

interface Props {
  name?: string | null;
  phone?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export function ProfileForm({
  name = "",
  phone = "",
  street = "",
  city = "",
  state = "",
  postalCode = "",
  country = "",
}: Props) {
  const navigate = useNavigate();
  const form = useAppForm({
    defaultValues: {
      name,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
    },
    validators: { onChange: profileSchema },
    onSubmit: async ({ value }) => {
      mutate({
        data: {
          name: value.name ?? "",
          phone: value.phone ?? "",
          street: value.street ?? "",
          city: value.city ?? "",
          state: value.state ?? "",
          postalCode: value.postalCode ?? "",
          country: value.country ?? "",
        },
      });
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: saveProfileFn,
    onSuccess: () => {
      toast.success("Your profile has been saved.");
      setTimeout(() => navigate({ to: "/" }), 250);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Could not save your profile");
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <section className="rounded-lg border bg-white p-4 shadow-sm md:p-5">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Account
                </h2>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <form.AppField name="name">
                    {(f) => (
                      <f.TextField
                        label="Name / Business"
                        placeholder="Acme LLC"
                        autoComplete="name"
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="phone">
                    {(f) => (
                      <f.TextField
                        label="Phone"
                        placeholder="+1 555 123 4567"
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    )}
                  </form.AppField>
                </div>
              </section>
              <section className="rounded-lg border bg-white p-4 shadow-sm md:p-5">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Address
                </h2>
                <div className="mt-3 grid grid-cols-1 gap-3 md:gap-4">
                  <form.AppField name="street">
                    {(f) => (
                      <f.TextField
                        label="Street"
                        placeholder="123 Main St"
                        autoComplete="street-address"
                      />
                    )}
                  </form.AppField>
                  <div className="grid grid-cols-2 gap-3">
                    <form.AppField name="city">
                      {(f) => (
                        <f.TextField
                          label="City"
                          placeholder="Irvine"
                          autoComplete="address-level2"
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="state">
                      {(f) => (
                        <f.TextField
                          label="State / Province"
                          placeholder="California"
                          autoComplete="address-level1"
                        />
                      )}
                    </form.AppField>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <form.AppField name="postalCode">
                      {(f) => (
                        <f.TextField
                          label="Postal Code"
                          placeholder="92610"
                          inputMode="numeric"
                          autoComplete="postal-code"
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="country">
                      {(f) => (
                        <f.TextField
                          label="Country"
                          placeholder="United States"
                          autoComplete="country-name"
                        />
                      )}
                    </form.AppField>
                  </div>
                </div>
              </section>
              <form.Subscribe selector={(s) => s.values}>
                {(values) => (
                  <section className="rounded-lg border bg-white p-4 shadow-sm md:p-5 lg:hidden">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Preview
                    </h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="font-medium">{values.name || "—"}</div>
                      <div className="text-muted-foreground">
                        {values.phone || "—"}
                      </div>
                      <div className="text-muted-foreground">
                        {[values.street, values.city, values.state]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </div>
                      <div className="text-muted-foreground">
                        {[values.postalCode, values.country]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </div>
                    </div>
                  </section>
                )}
              </form.Subscribe>

              <div className="h-20 lg:h-0" />
            </div>
            <div className="hidden lg:block">
              <form.Subscribe selector={(s) => s.values}>
                {(values) => (
                  <aside className="sticky top-4 rounded-lg border bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Summary
                    </h3>
                    <div className="mt-3 space-y-2 text-sm">
                      <div>
                        <div className="font-medium">{values.name || "—"}</div>
                        <div className="text-muted-foreground">
                          {values.phone || "—"}
                        </div>
                      </div>
                      <div className="text-muted-foreground">
                        {[values.street, values.city, values.state]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </div>
                      <div className="text-muted-foreground">
                        {[values.postalCode, values.country]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="mt-4 w-full"
                    >
                      {isPending ? "Saving..." : "Save profile"}
                    </Button>
                  </aside>
                )}
              </form.Subscribe>
            </div>
          </div>
        </div>
        <form.Subscribe selector={(s) => s.canSubmit}>
          {(canSubmit) => (
            <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 lg:hidden">
              <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 p-3">
                <div className="text-sm">
                  <div className="text-muted-foreground">Status</div>
                  <div className="text-lg font-semibold">
                    {canSubmit ? "Ready to save" : "Fill required fields"}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isPending || !canSubmit}
                  className="px-6"
                >
                  {isPending ? "Saving..." : "Save profile"}
                </Button>
              </div>
            </div>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
