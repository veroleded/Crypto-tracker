"use client";

import { Suspense } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@acme/ui/card";
import { cn } from "@acme/ui/utils";
import { ErrorContent } from "~/components/error-content";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:mt-16">
      <Card
        className={cn(
          "w-full max-w-md border-destructive/50",
          "duration-1000 animate-in fade-in zoom-in",
        )}
      >
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 animate-pulse text-destructive" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-destructive">
            Error
          </h1>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-center text-muted-foreground">Loading...</p>}>
            <ErrorContent />
          </Suspense>
        </CardContent>
        <CardFooter>
          <Button
            asChild
            variant="destructive"
            className="w-full duration-300 hover:scale-[1.02]"
          >
            <Link href="/sign-in">Return to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}