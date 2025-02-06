import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Input } from "@acme/ui/input";

import { login } from "~/actions/auth";
import { FormError } from "~/components/form-error";
import { PasswordInput } from "~/components/password-input";
import { SubmitButton } from "~/components/ui/submit-button";

export default function SignInPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center px-4 py-6">
      <Card className="w-full max-w-[380px] shadow-lg">
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
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="h-12 bg-background px-4 py-3 text-base"
                />
              </div>
              <div>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <SubmitButton
                formAction={login}
                className="h-12 bg-blue-600 text-base text-white hover:bg-blue-700"
              >
                Sign in
              </SubmitButton>
              <FormError />
              <div className="m-auto mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                Don't have an account?{" "}
                <a
                  href="/sign-up"
                  className="font-medium text-blue-600 underline transition-colors hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
                >
                  Create one
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
