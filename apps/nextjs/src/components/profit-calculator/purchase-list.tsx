import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@acme/ui/button";
import { api } from "~/trpc/react";

import type { Purchase } from "./types";

const formatNumber = (value: number, minFractionDigits = 2, maxFractionDigits = 8) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits,
  });
};

interface PurchaseCardProps {
  purchase: Purchase;
  coinName: string;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function PurchaseCard({ purchase, coinName, onDelete, isDeleting }: PurchaseCardProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-700 p-4 shadow-sm transition-colors hover:bg-gray-600">
      <div className="space-y-1">
        <p className="text-sm text-gray-100">
          Amount:{" "}
          <span className="font-medium">
            {formatNumber(Number(purchase.amount))} {coinName}
          </span>
        </p>
        <p className="text-sm text-gray-100">
          Price:{" "}
          <span className="font-medium">
            ${formatNumber(Number(purchase.purchasePrice))}
          </span>
        </p>
        <p className="text-xs text-gray-400">
          Date: {new Date(purchase.purchaseDate).toLocaleDateString()}
        </p>
      </div>
      <Button
        onClick={() => onDelete(purchase.id)}
        variant="destructive"
        size="sm"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <>
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Removing...
          </>
        ) : (
          "Remove"
        )}
      </Button>
    </div>
  );
}

interface PurchaseListProps {
  purchases: Purchase[];
  coinName: string;
  coinId: string;
}

export function PurchaseList({
  purchases,
  coinName,
  coinId,
}: PurchaseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const utils = api.useUtils();
  const { mutate: deletePurchase } = api.purchase.delete.useMutation({
    onMutate: async ({ id }) => {
      setDeletingId(id);

      // Отменяем исходящие запросы рефетча
      await utils.purchase.getByCoinId.cancel();

      // Сохраняем предыдущие данные
      const previousPurchases = utils.purchase.getByCoinId.getData({ coinId });

      // Оптимистично обновляем кэш
      utils.purchase.getByCoinId.setData(
        { coinId },
        (old) => old?.filter((p) => p.id !== id) ?? []
      );

      return { previousPurchases };
    },
    onError: (error, variables, context) => {
      console.error('Delete error:', error);
      // Возвращаем предыдущие данные в случае ошибки
      if (context?.previousPurchases) {
        utils.purchase.getByCoinId.setData(
          { coinId },
          context.previousPurchases
        );
      }
      setDeletingId(null);
    },
    onSuccess: () => {
      // Обновляем данные на сервере
      void utils.purchase.getByCoinId.invalidate({ coinId });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = useCallback((id: string) => {
    deletePurchase({ id });
  }, [deletePurchase]);

  if (!purchases.length) return null;

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold text-white">Your Purchases</h3>
      <div className="max-h-[300px] space-y-3 overflow-y-auto pr-2">
        {purchases.map((purchase) => (
          <PurchaseCard
            key={purchase.id}
            purchase={purchase}
            coinName={coinName}
            onDelete={handleDelete}
            isDeleting={deletingId === purchase.id}
          />
        ))}
      </div>
    </div>
  );
}
