"use client";

import type { ComponentProps } from "react";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@acme/ui/button";
import { cn } from "@acme/ui/utils";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
  showSpinner?: boolean;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  showSpinner = true,
  className,
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className={cn(
        "relative",
        "transition-all duration-300",
        "disabled:cursor-not-allowed",
        "active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "flex items-center gap-2",

          pending ? "opacity-0" : "opacity-100",
        )}
      >
        {children}
      </span>
      {pending && showSpinner && (
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "flex items-center gap-2",
            "transition-opacity duration-300",
            pending ? "opacity-100" : "opacity-0",
          )}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{pendingText}</span>
        </div>
      )}
    </Button>
  );
}