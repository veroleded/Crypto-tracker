import Link from "next/link";

import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

export default function VerifyEmailPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center px-4 py-6">
      <Card className="w-full max-w-[380px] shadow-lg">
        <CardHeader className="space-y-3 pb-8">
          <CardTitle className="text-center text-2xl font-semibold tracking-tight">
            Check your email
          </CardTitle>
          <CardDescription className="text-center text-base">
            We've sent you an email with a link to verify your account. Please
            check your inbox and spam folder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="h-12 bg-blue-600 text-base text-white hover:bg-blue-700"
            >
              <Link href="/sign-in">Back to Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
