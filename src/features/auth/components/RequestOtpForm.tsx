import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";

import { getRequestOtpMutationOptions } from "@/features/auth/server/requestOtpFn";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  onSuccess: (email: string) => void;
}

export function RequestOtpForm({ onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const requestOtp = useMutation({
    ...getRequestOtpMutationOptions(),
    onSuccess: () => onSuccess(email),
    onError: (err: Error) => setError(err.message),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    requestOtp.mutate({ data: { email } });
  };

  return (
    <CardContent>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={requestOtp.isPending}
        >
          {requestOtp.isPending ? "Sending..." : "Send Code"}
        </Button>
      </form>
    </CardContent>
  );
}
