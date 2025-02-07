import { useMemo } from "react";

import { cn } from "@acme/ui/utils";

import { Container } from "./container";

interface Props {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: Props) {
  const headerContent = useMemo(
    () => ({
      title: title.trim(),
      description: description?.trim(),
    }),
    [title, description],
  );

  return (
    <Container>
      <div
        className={cn(
          "border-b pb-5 duration-1000 animate-in fade-in slide-in-from-top-4",
          className,
        )}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground/90 sm:text-4xl">
          {headerContent.title}
        </h1>
        {headerContent.description && (
          <p className="mt-3 text-lg text-muted-foreground">
            {headerContent.description}
          </p>
        )}
      </div>
    </Container>
  );
}
