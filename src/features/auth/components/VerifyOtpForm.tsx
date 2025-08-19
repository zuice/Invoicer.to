import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";

import { getVerifyOtpMutationOptions } from "../server/verifyOtpFn";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface Props {
  email: string;
  onSuccess: () => void;
}

export function VerifyOtpForm({ email, onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const verifyOtp = useMutation({
    ...getVerifyOtpMutationOptions(),
    onSuccess: () => onSuccess(),
    onError: (err: Error) => setError(err.message),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    verifyOtp.mutate({ data: { email, code } });
  };

  return (
    <CardContent>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button type="submit" className="w-full" disabled={verifyOtp.isPending}>
          {verifyOtp.isPending ? "Verifying..." : "Verify Code"}
        </Button>
      </form>
    </CardContent>
  );
}
