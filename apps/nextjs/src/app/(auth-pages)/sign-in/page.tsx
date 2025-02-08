import { Suspense } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { cn } from "@acme/ui/utils";

import { login } from "~/actions/auth";
import { FormError } from "~/components/form-error";
import { PasswordInput } from "~/components/password-input";
import { SubmitButton } from "~/components/ui/submit-button";

export default function SignInPage() {
  return (
    <Card
      className={cn(
        "w-full shadow-lg",
        "sm:shadow-xl",
        "h-full sm:h-auto",
        "rounded-none sm:rounded-lg",
        "transition-all duration-300",
      )}
    >
      <CardHeader className="space-y-3 pb-8">
        <CardTitle className="text-center text-2xl font-semibold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center text-base">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className={cn(
                  "h-12 bg-background px-4 py-3 text-base",
                  "transition-all duration-300",
                  "focus:ring-2 focus:ring-blue-500/50",
                )}
              />
            </div>
            <div className="space-y-2">
              <PasswordInput
                id="password"
                name="password"
                placeholder="••••••••"
                required
                className={cn(
                  "transition-all duration-300",
                  "focus:ring-2 focus:ring-blue-500/50",
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <SubmitButton
              formAction={login}
              className={cn(
                "h-12 text-base",
                "bg-blue-600 text-white",
                "hover:bg-blue-700",
                "transition-all duration-300",
              )}
            >
              Sign in
            </SubmitButton>
            <Suspense fallback={null}>
              <FormError />
            </Suspense>
            <div className="m-auto mt-2 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className={cn(
                  "font-medium text-blue-600 underline-offset-4",
                  "hover:text-blue-700 hover:underline",
                  "transition-colors duration-300",
                )}
              >
                Create one
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
