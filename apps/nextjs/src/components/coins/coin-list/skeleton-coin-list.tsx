import { Skeleton } from "@acme/ui/skeleton";
import { Pagination } from "./pagination";

interface Props {
  currentPage: number;
}

export function SkeletonCoinList({ currentPage }: Props) {
  return (
    <div className="mx-auto w-full max-w-[1920px] space-y-6 px-4 sm:px-6 lg:px-8">
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

      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={() => {
          // Пустая функция, так как во время загрузки пагинация неактивна
        }}
      />
    </div>
  );
}
