"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
  invalid_code: "Invalid authorization code",
  unexpected_error: "An unexpected error occurred",
  invalid_credentials: "Invalid email or password",
  "Token has expired or is invalid":
    "Verification link has expired or already been used",
  // Add more error messages as needed
};

export function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const displayMessage = useMemo(
    () => (message ? (errorMessages[message] ?? message) : "An error occurred"),
    [message],
  );

  return <p className="text-center text-muted-foreground">{displayMessage}</p>;
}
