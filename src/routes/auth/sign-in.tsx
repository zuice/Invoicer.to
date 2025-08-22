import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RequestOtpForm } from "@/features/auth/components/RequestOtpForm";
import { VerifyOtpForm } from "@/features/auth/components/VerifyOtpForm";

export const Route = createFileRoute("/auth/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {step === "email" ? "Sign in" : "Enter OTP"}
        </CardTitle>
        <CardDescription>
          {step === "email"
            ? "Enter your email to receive a one-time code."
            : `We sent a code to ${email}`}
        </CardDescription>
      </CardHeader>

      {step === "email" && (
        <RequestOtpForm
          onSuccess={(email) => {
            setEmail(email);
            setStep("otp");
          }}
        />
      )}

      {step === "otp" && (
        <VerifyOtpForm
          email={email}
          onSuccess={() => {
            navigate({ to: "/" });
          }}
        />
      )}
    </Card>
  );
}
