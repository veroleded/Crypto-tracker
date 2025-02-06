"use client";

import { useSearchParams } from "next/navigation";

export function FormError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("message");

  if (!error) return null;

  return <div className="text-center text-sm text-red-500">{error}</div>;
}
