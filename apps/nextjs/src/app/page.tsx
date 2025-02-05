import { CoinList } from "~/components/coins/coin-list";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <div className="mb-4 flex items-center justify-between border-b border-gray-50 pb-2">
          <h2 className="text-xl font-bold">Top 100 Cryptocurrencies</h2>
        </div>

        <CoinList />
      </div>
    </div>
  );
}
