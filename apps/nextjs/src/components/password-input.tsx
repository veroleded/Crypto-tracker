"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { cn } from "@acme/ui/utils";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="group relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn(
          "h-12 bg-background px-4 py-3 pr-10 text-base",
          "transition-all duration-300",
          "focus:ring-2 focus:ring-blue-500/50",
          "placeholder:transition-opacity",
          "group-hover:placeholder:opacity-70",
          className,
        )}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "absolute right-0 top-0 h-full px-3 py-2",
          "transition-all duration-300",
          "hover:bg-transparent",
          "opacity-70 hover:opacity-100",
          "focus-visible:ring-2 focus-visible:ring-blue-500/50",
        )}
        onClick={() => setShowPassword((prev) => !prev)}
      >
        <div className="relative h-4 w-4">
          <div
            className={cn(
              "absolute inset-0 transition-transform duration-300",
              showPassword ? "scale-0" : "scale-100",
            )}
          >
            <Eye className="h-4 w-4 text-muted-foreground" />
          </div>
          <div
            className={cn(
              "absolute inset-0 transition-transform duration-300",
              showPassword ? "scale-100" : "scale-0",
            )}
          >
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
}
