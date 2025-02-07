"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
  invalid_code: "Invalid authorization code",
  unexpected_error: "An unexpected error occurred",
  invalid_credentials: "Invalid email or password",
  "Token has expired or is invalid":
    "Verification link has expired or already been used",
  // Add more error messages as needed
};

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const displayMessage = message
    ? (errorMessages[message] ?? message)
    : "An error occurred";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="rounded-lg bg-red-50 p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Error</h1>
        <p className="mb-6 text-gray-700">{displayMessage}</p>
        <Link
          href="/sign-in"
          className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}
