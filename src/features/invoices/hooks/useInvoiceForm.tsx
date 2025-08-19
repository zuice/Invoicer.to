import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  return (
    <Label className="flex flex-col gap-2">
      <span>{label}</span>
      <Input
        className="border p-1 font-normal"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <span className="text-red-500 text-xs h-4">
        {field.state.meta.errors?.[0]?.message}
      </span>
    </Label>
  );
}

function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(s) => s.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : label}
        </Button>
      )}
    </form.Subscribe>
  );
}

export const {
  useAppForm: useInvoiceForm,
  withForm,
  withFieldGroup,
} = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
});
