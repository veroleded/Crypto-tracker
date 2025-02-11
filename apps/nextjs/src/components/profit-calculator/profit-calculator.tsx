import { api } from "~/trpc/react";
import { ProfitSummary } from "./profit-summary";
import { PurchaseForm } from "./purchase-form";
import { PurchaseList } from "./purchase-list";
import { ProfitCalculatorSkeleton } from "./skeleton";
import type { Purchase } from "./types";

interface ProfitCalculatorProps {
  coinId: string;
  currentPrice: number;
  coinName: string;
}

export function ProfitCalculator({
  currentPrice,
  coinName,
  coinId,
}: ProfitCalculatorProps) {
  const utils = api.useUtils();

  const { data: purchases, isLoading } = api.purchase.getByCoinId.useQuery({
    coinId,
  });

  const { mutate: createPurchase, status } = api.purchase.create.useMutation({
    onSuccess: () => {
      void utils.purchase.getByCoinId.invalidate({ coinId });
    },
  });

  const calculateTotals = () => {
    if (!purchases?.length) return null;

    let totalInvested = 0;
    let totalCoins = 0;

    purchases.forEach((purchase: Purchase) => {
      totalInvested += Number(purchase.amount) * Number(purchase.purchasePrice);
      totalCoins += Number(purchase.amount);
    });

    const currentValue = totalCoins * currentPrice;
    const totalProfit = currentValue - totalInvested;
    const profitPercentage = (totalProfit / totalInvested) * 100;

    return {
      totalInvested,
      currentValue,
      totalProfit,
      profitPercentage,
      totalCoins,
    };
  };

  const totals = calculateTotals();

  if (isLoading) {
    return <ProfitCalculatorSkeleton />;
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-white">
        Profit Calculator for {coinName}
      </h2>

      <PurchaseForm
        onSubmit={(data) => {
          createPurchase({
            coinId,
            ...data,
          });
        }}
        isSubmitting={status === "pending"}
      />

      {purchases && (
        <PurchaseList
          purchases={purchases}
          coinName={coinName}
          coinId={coinId}
        />
      )}

      {totals && <ProfitSummary data={totals} coinName={coinName} />}
    </div>
  );
}
