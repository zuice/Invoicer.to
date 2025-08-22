import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { useAppForm } from "@/features/forms/hooks/useAppForm";
import { Button } from "@/components/ui/button";
import { requestOtpFn } from "@/features/auth/server/requestOtpFn";
import { verifyOtpFn } from "@/features/auth/server/verifyOtpFn";
import { requestOtpSchema, verifyOtpSchema } from "@/features/auth/schemas";

export function SignInForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const form = useAppForm({
    defaultValues: {
      email: "",
      code: "",
    },
    validators: {
      onChange: step === "email" ? requestOtpSchema : verifyOtpSchema,
    },
    onSubmit: async ({ value }) => {
      if (step === "email") {
        requestMutate({ data: { email: value.email } });
      } else {
        verifyMutate({ data: { email: value.email, code: value.code } });
      }
    },
  });

  const { mutate: requestMutate, isPending: isRequesting } = useMutation({
    mutationFn: requestOtpFn,
    onSuccess: () => {
      toast.success("We sent you a code.");
      setStep("otp");
      // optional: focus code input
    },
    onError: (err: any) => {
      toast.error(err?.message || "Could not send code");
    },
  });

  const { mutate: verifyMutate, isPending: isVerifying } = useMutation({
    mutationFn: verifyOtpFn,
    onSuccess: (res: any) => {
      toast.success("Signed in successfully");
      const isNewUser = res?.isNewUser ?? false;
      const isActive = res?.isActive ?? true; // if you return this
      if (isNewUser || !isActive) {
        navigate({ to: "/auth/complete-profile" });
      } else {
        navigate({ to: "/" });
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Invalid or expired code");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const isPending = isRequesting || isVerifying;

  return (
    <form onSubmit={handleSubmit}>
      <form.AppForm>
        <div className="w-full md:max-w-md">
          <section className="rounded-lg border bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-xl font-semibold">
              {step === "email" ? "Sign in" : "Enter code"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === "email"
                ? "Enter your email to receive a one-time code."
                : `We sent a code to ${form.getFieldValue("email")}`}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <form.AppField name="email">
                {(f) => (
                  <f.TextField
                    label="Email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    disabled={step === "otp" || isPending}
                  />
                )}
              </form.AppField>

              {step === "otp" && (
                <form.AppField name="code">
                  {(f) => (
                    <f.TextField
                      label="One-time code"
                      placeholder="123456"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      disabled={isPending}
                    />
                  )}
                </form.AppField>
              )}
            </div>

            <div className="mt-4 flex items-center gap-3">
              {step === "otp" ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isPending}
                    onClick={() => {
                      setStep("email");
                      form.setFieldValue("code", "");
                    }}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isPending} className="flex-1">
                    {isVerifying ? "Verifying..." : "Verify & Sign in"}
                  </Button>
                </>
              ) : (
                <Button type="submit" disabled={isPending} className="w-full">
                  {isRequesting ? "Sending..." : "Send code"}
                </Button>
              )}
            </div>

            {step === "otp" && (
              <button
                type="button"
                className="mt-3 text-sm text-muted-foreground underline underline-offset-4"
                disabled={isPending}
                onClick={() =>
                  requestMutate({
                    data: { email: form.getFieldValue("email") },
                  })
                }
              >
                Resend code
              </button>
            )}
          </section>
        </div>
      </form.AppForm>
    </form>
  );
}
