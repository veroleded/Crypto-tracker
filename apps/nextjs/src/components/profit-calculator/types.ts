export interface Purchase {
  id: string;
  amount: string;
  purchasePrice: string;
  purchaseDate: Date;
}

export interface ProfitCalculation {
  totalInvested: number;
  currentValue: number;
  totalProfit: number;
  profitPercentage: number;
  totalCoins: number;
} 