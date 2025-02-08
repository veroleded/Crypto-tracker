import { Skeleton } from "@acme/ui/skeleton";

export function ProfitCalculatorSkeleton() {
  return (
    <div className="space-y-6 rounded-lg border border-gray-700 bg-gray-800 p-6">
      {/* Title skeleton */}
      <Skeleton className="h-8 w-2/3" />

      {/* Form skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Results skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-700 p-4"
            >
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="ml-4 h-8 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Total Results skeleton */}
      <div className="rounded-md border border-gray-700 bg-gray-700 p-6">
        <Skeleton className="h-6 w-32" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-gray-600 pb-3"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
