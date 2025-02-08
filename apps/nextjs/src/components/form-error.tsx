"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { Alert, AlertDescription } from "@acme/ui/alert";
import { cn } from "@acme/ui/utils";

const errorMessages: Record<string, string> = {
  invalid_code: "Invalid authorization code",
  unexpected_error: "An unexpected error occurred",
  invalid_credentials: "Invalid email or password",
  "Token has expired or is invalid":
    "Verification link has expired or already been used",
  // Add more error messages as needed
};

export function FormError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("message");

  const displayMessage = useMemo(
    () => (error ? (errorMessages[error] ?? error) : null),
    [error],
  );

  if (!displayMessage) return null;

  return (
    <Alert
      variant="destructive"
      className={cn(
        "flex items-center gap-2",
        "bg-destructive/5 text-destructive",
        "duration-300 animate-in fade-in-0 slide-in-from-top-1",
      )}
    >
      <AlertDescription className="text-sm font-medium">
        {displayMessage}
      </AlertDescription>
    </Alert>
  );
}
