import { ComponentProps } from "react";
import {
  createFormHookContexts,
  createFormHook,
  AnyFieldApi,
} from "@tanstack/react-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

function FieldError({ field }: { field: AnyFieldApi }) {
  return (
    <span className="text-red-500 text-xs h-4">
      {field.state.meta.isTouched && field.state.meta.errors?.[0]?.message}
    </span>
  );
}

function TextField({
  label,
  className,
  ...props
}: ComponentProps<"input"> & { label: string }) {
  const field = useFieldContext<string>();

  return (
    <Label className="flex flex-col gap-2">
      <span>{label}</span>
      <Input
        {...props}
        className={["border p-1 font-normal", className]
          .filter(Boolean)
          .join(" ")}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldError field={field} />
    </Label>
  );
}

function SelectField({
  label,
  options,
  placeholder,
  className,
}: {
  label: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}) {
  const field = useFieldContext<string>();

  return (
    <Label className="flex flex-col gap-2">
      <span>{label}</span>
      <Select
        value={field.state.value ?? undefined}
        onValueChange={(v) => field.handleChange(v)}
      >
        <SelectTrigger aria-label={label} className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ label, value }, index) => (
            <SelectItem key={index} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError field={field} />
    </Label>
  );
}

function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(s) => ({
        isSubmitting: s.isSubmitting,
        canSubmit: s.canSubmit,
      })}
    >
      {({ isSubmitting, canSubmit }) => (
        <Button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "Saving..." : label}
        </Button>
      )}
    </form.Subscribe>
  );
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    SelectField,
  },
  formComponents: {
    SubmitButton,
  },
});
