import { ZodIssueOptionalMessage } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = React.ComponentProps<"input"> & {
  label: string;
  errors: ZodIssueOptionalMessage[];
};

export function InputGroup({ id, label, errors, ...props }: Props) {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-errormessage={errors?.map((error) => error.message).join(", ")}
        className={
          errors?.length ? "border-red-500 focus-visible:ring-red-500" : ""
        }
        {...props}
      />
      {errors && (
        <ul className="flex flex-col">
          {errors?.map((error) => (
            <li key={error?.code} className="text-red-500">
              {error?.message}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
