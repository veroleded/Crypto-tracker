import { CoinList } from "~/components/coin-list";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Crypto Tracker</h1>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-lg bg-muted p-4">
          <div className="text-sm text-muted-foreground">
            Top 100 Cryptocurrencies
          </div>
        </div>

        <CoinList />
      </div>
    </div>
  );
}