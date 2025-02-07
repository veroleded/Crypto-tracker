import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@acme/ui/alert";
import { cn } from "@acme/ui/utils";

import { Container } from "~/components/layout/container";

interface Props {
  title?: string;
  message: string;
  className?: string;
}

export function ErrorMessage({ title = "Error", message, className }: Props) {
  return (
    <Container>
      <Alert
        variant="destructive"
        className={cn(
          "duration-1000 animate-in fade-in zoom-in",
          "border-destructive/50 bg-destructive/10",
          className,
        )}
      >
        <AlertCircle className="h-5 w-5 animate-pulse" />
        <AlertTitle className="text-destructive">{title}</AlertTitle>
        <AlertDescription className="text-destructive/90">
          {message}
        </AlertDescription>
      </Alert>
    </Container>
  );
}
