import { Card, CardContent } from "@acme/ui/card";
import { Skeleton } from "@acme/ui/skeleton";

export function SkeletonCoinList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
