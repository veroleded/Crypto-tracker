import { Button } from "@acme/ui/button";
import { useState } from "react";
import { SubmitButton } from "~/components/ui/submit-button";
import { api } from "~/trpc/react";
import { ProfitCalculatorSkeleton } from "./skeleton";

interface ProfitCalculatorProps {
  coinId: string;
  currentPrice: number;
  coinName: string;
}

interface Purchase {
  id: string;
  amount: string;
  purchasePrice: string;
  purchaseDate: Date;
}

export function ProfitCalculator({ currentPrice, coinName, coinId }: ProfitCalculatorProps) {
  const [amount, setAmount] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const utils = api.useUtils();

  // Fetch purchases from the database
  const { data: purchases, isLoading } = api.purchase.getByCoinId.useQuery({
    coinId,
  });

  // Create purchase mutation
  const { mutate: createPurchase } = api.purchase.create.useMutation({
    onSuccess: () => {
      // Reset form
      setAmount("");
      setPurchasePrice("");
      setPurchaseDate("");
      // Refresh purchases list
      void utils.purchase.getByCoinId.invalidate({ coinId });
    },
  });

  // Delete purchase mutation
  const { mutate: deletePurchase } = api.purchase.delete.useMutation({
    onSuccess: () => {
      // Refresh purchases list
      void utils.purchase.getByCoinId.invalidate({ coinId });
    },
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    const purchasePriceNum = parseFloat(purchasePrice);

    if (isNaN(amountNum) || isNaN(purchasePriceNum)) {
      return;
    }

    createPurchase({
      coinId,
      amount: amountNum,
      purchasePrice: purchasePriceNum,
      purchaseDate: purchaseDate,
    });
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  // Calculate total results
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
      <h2 className="text-2xl font-bold text-white">Profit Calculator for {coinName}</h2>

      <form onSubmit={handleCalculate} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium text-gray-300">
            Amount of Coins
          </label>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => handleNumberInput(e, setAmount)}
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="purchasePrice" className="text-sm font-medium text-gray-300">
            Purchase Price (USD)
          </label>
          <input
            id="purchasePrice"
            type="text"
            inputMode="decimal"
            value={purchasePrice}
            onChange={(e) => handleNumberInput(e, setPurchasePrice)}
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="purchaseDate" className="text-sm font-medium text-gray-300">
            Purchase Date
          </label>
          <input
            id="purchaseDate"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <SubmitButton
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Add Purchase
        </SubmitButton>
      </form>

      {purchases && purchases.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-white">Your Purchases</h3>
          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
            {purchases.map((purchase: Purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-700 p-4 shadow-sm transition-colors hover:bg-gray-600"
              >
                <div className="space-y-1">
                  <p className="text-sm text-gray-100">
                    Amount: <span className="font-medium">{Number(purchase.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8,
                    })} {coinName}</span>
                  </p>
                  <p className="text-sm text-gray-100">
                    Price: <span className="font-medium">${Number(purchase.purchasePrice).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8,
                    })}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Date: {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={() => deletePurchase({ id: purchase.id })}
                  variant="destructive"
                // className="ml-4 rounded-md bg-red-900/50 p-2 text-red-400 transition-colors hover:bg-red-900/70 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {totals && (
        <div className="mt-8 rounded-md border border-gray-700 bg-gray-700 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-white">Total Results</h3>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-600 pb-3">
              <span className="text-gray-300">Total Coins</span>
              <span className="text-gray-100 font-medium">
                {totals.totalCoins.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
                })} {coinName}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-600 pb-3">
              <span className="text-gray-300">Current Value</span>
              <span className="text-gray-100 font-medium">
                ${totals.currentValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-600 pb-3">
              <span className="text-gray-300">Total Investment</span>
              <span className="text-gray-100 font-medium">
                ${totals.totalInvested.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-300">
                {totals.totalProfit >= 0 ? "Total Profit" : "Total Loss"}
              </span>
              <div className="text-right">
                <div className={
                  totals.totalProfit >= 0 
                    ? "text-green-400 font-bold text-xl"
                    : "text-red-400 font-bold text-xl"
                }>
                  ${Math.abs(totals.totalProfit).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8,
                  })}
                </div>
                <div className={
                  totals.totalProfit >= 0 
                    ? "text-green-500 font-medium text-sm"
                    : "text-red-500 font-medium text-sm"
                }>
                  ({totals.profitPercentage >= 0 ? "+" : ""}
                  {totals.profitPercentage.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 