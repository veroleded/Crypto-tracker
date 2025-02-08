import type { ProfitCalculation } from "./types";

interface ProfitSummaryProps {
  data: ProfitCalculation;
  coinName: string;
}

export function ProfitSummary({ data, coinName }: ProfitSummaryProps) {
  return (
    <div className="mt-8 rounded-md border border-gray-700 bg-gray-700 p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-white">Total Results</h3>
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-600 pb-3">
          <span className="text-gray-300">Total Coins</span>
          <span className="font-medium text-gray-100">
            {data.totalCoins.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            })}{" "}
            {coinName}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-gray-600 pb-3">
          <span className="text-gray-300">Current Value</span>
          <span className="font-medium text-gray-100">
            $
            {data.currentValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            })}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-gray-600 pb-3">
          <span className="text-gray-300">Total Investment</span>
          <span className="font-medium text-gray-100">
            $
            {data.totalInvested.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            })}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-gray-300">
            {data.totalProfit >= 0 ? "Total Profit" : "Total Loss"}
          </span>
          <div className="text-right">
            <div
              className={
                data.totalProfit >= 0
                  ? "text-xl font-bold text-green-400"
                  : "text-xl font-bold text-red-400"
              }
            >
              $
              {Math.abs(data.totalProfit).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
            </div>
            <div
              className={
                data.totalProfit >= 0
                  ? "text-sm font-medium text-green-500"
                  : "text-sm font-medium text-red-500"
              }
            >
              ({data.profitPercentage >= 0 ? "+" : ""}
              {data.profitPercentage.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
