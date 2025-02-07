import { CoinList } from "~/components/coins/coin-list";
import { PageHeader } from "~/components/layout/page-header";

export default function HomePage() {
  return (
    <div className="mt-16 flex-1 py-8">
      <PageHeader
        title="Top 100 Cryptocurrencies"
        description="Track real-time prices, market cap, and trading volume of the top cryptocurrencies"
      />
      <div className="mt-8">
        <CoinList />
      </div>
    </div>
  );
}