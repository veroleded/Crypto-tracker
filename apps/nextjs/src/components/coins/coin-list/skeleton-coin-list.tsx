import { Skeleton } from "@acme/ui/skeleton";

export function SkeletonCoinList() {
  return (
    <div className="mx-auto max-w-full space-y-6 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="mt-1 h-4 w-12" />
              </div>
            </div>

            <div className="text-right">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="mt-1 h-4 w-16" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
  );
}
