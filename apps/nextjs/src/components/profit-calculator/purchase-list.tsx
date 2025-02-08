import { Button } from "@acme/ui/button";

import type { Purchase } from "./types";

interface PurchaseListProps {
  purchases: Purchase[];
  coinName: string;
  onDelete: (id: string) => void;
}

export function PurchaseList({
  purchases,
  coinName,
  onDelete,
}: PurchaseListProps) {
  if (!purchases.length) return null;

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold text-white">Your Purchases</h3>
      <div className="max-h-[300px] space-y-3 overflow-y-auto pr-2">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-700 p-4 shadow-sm transition-colors hover:bg-gray-600"
          >
            <div className="space-y-1">
              <p className="text-sm text-gray-100">
                Amount:{" "}
                <span className="font-medium">
                  {Number(purchase.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8,
                  })}{" "}
                  {coinName}
                </span>
              </p>
              <p className="text-sm text-gray-100">
                Price:{" "}
                <span className="font-medium">
                  $
                  {Number(purchase.purchasePrice).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8,
                  })}
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
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
