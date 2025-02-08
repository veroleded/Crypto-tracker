import { useMemo } from "react";

import { Card, CardContent, CardHeader } from "@acme/ui/card";
import { Skeleton } from "@acme/ui/skeleton";

function SkeletonHeader() {
  return (
    <header className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
    </header>
  );
}

function SkeletonPrice() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonStats() {
  const items = useMemo(() => Array.from({ length: 6 }), []);

  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SkeletonDescription() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

export function SkeletonCoinDetails() {
  const sections = useMemo(
    () => [
      { id: "price", Component: SkeletonPrice },
      { id: "stats", Component: SkeletonStats },
      { id: "description", Component: SkeletonDescription },
    ],
    [],
  );

  return (
    <div className="space-y-8 duration-500 animate-in fade-in fill-mode-both">
      <SkeletonHeader />
      <div className="grid grid-cols-1 gap-6">
        {sections.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </div>
    </div>
  );
}
