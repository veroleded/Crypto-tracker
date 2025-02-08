import type { FormEvent } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@acme/ui/button";

const MAX_DATE = "9999-12-31";
const MIN_DATE = "2009-01-03";

interface PurchaseFormProps {
  onSubmit: (data: {
    amount: number;
    purchasePrice: number;
    purchaseDate: string;
  }) => void;
  isSubmitting: boolean;
}

export function PurchaseForm({ onSubmit, isSubmitting }: PurchaseFormProps) {
  const [amount, setAmount] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    const purchasePriceNum = parseFloat(purchasePrice);

    if (isNaN(amountNum) || isNaN(purchasePriceNum)) {
      return;
    }

    const date = new Date(purchaseDate);
    if (date < new Date(MIN_DATE) || date > new Date(MAX_DATE)) {
      return;
    }

    onSubmit({
      amount: amountNum,
      purchasePrice: purchasePriceNum,
      purchaseDate,
    });
  };

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
        <label
          htmlFor="purchasePrice"
          className="text-sm font-medium text-gray-300"
        >
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
        <label
          htmlFor="purchaseDate"
          className="text-sm font-medium text-gray-300"
        >
          Purchase Date
        </label>
        <input
          id="purchaseDate"
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          min={MIN_DATE}
          max={MAX_DATE}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full bg-blue-600 text-base text-white transition-all duration-300 hover:bg-blue-700"
        size="lg"
        variant="primary"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Purchase...
          </>
        ) : (
          "Add Purchase"
        )}
      </Button>
    </form>
  );
}
