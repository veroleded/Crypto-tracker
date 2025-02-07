import { CoinList } from "~/components/coins/coin-list";
import { Container } from "~/components/layout/container";

export default function HomePage() {
  return (
    <div className="flex-1 py-8">
      <Container>
        <div className="border-b pb-5">
          <h1 className="text-2xl font-semibold leading-7">
            Top 100 Cryptocurrencies
          </h1>
        </div>
      </Container>

      <div className="mt-8">
        <CoinList />
      </div>
    </div>
  );
}