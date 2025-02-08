import { useMemo } from "react";

import type { CoinDetails } from "@acme/api/";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { cn } from "@acme/ui/utils";

interface Props {
  coin: CoinDetails;
}

export function CoinDescription({ coin }: Props) {
  const description = useMemo(
    () => coin.description?.en,
    [coin.description?.en],
  );

  if (!description) return null;

  return (
    <section aria-label={`About ${coin.name}`}>
      <Card className="overflow-hidden transition-colors hover:bg-accent/5">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-semibold tracking-tight">
            About {coin.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "prose prose-sm dark:prose-invert max-w-none",
              "prose-headings:font-semibold prose-headings:tracking-tight",
              "prose-p:leading-relaxed",
              "prose-a:text-primary hover:prose-a:text-primary/80",
              "prose-strong:font-medium",
              "prose-code:rounded-sm prose-code:bg-muted prose-code:px-1 prose-code:font-mono prose-code:text-sm",
              "prose-pre:rounded-lg prose-pre:border",
            )}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </CardContent>
      </Card>
    </section>
  );
}
