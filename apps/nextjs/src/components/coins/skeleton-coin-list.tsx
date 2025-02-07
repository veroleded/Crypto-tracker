import { useMemo } from "react";

import { Card } from "@acme/ui/card";
import { Skeleton } from "@acme/ui/skeleton";

import { Container } from "~/components/layout/container";

const ITEMS_COUNT = 10;

function SkeletonItem() {
  return (
    <Card className="overflow-hidden">
      <div className="relative flex items-center gap-3 p-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="mt-1 h-4 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

export function SkeletonCoinList() {
  const items = useMemo(
    () => Array.from({ length: ITEMS_COUNT }).map((_, i) => i),
    [],
  );

  return (
    <Container className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {items.map((i) => (
          <SkeletonItem key={i} />
        ))}
      </div>
    </Container>
  );
}
