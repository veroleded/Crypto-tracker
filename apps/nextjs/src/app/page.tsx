import { CoinList } from "~/components/coins/coin-list";
import { api } from "~/trpc/server";

interface Props {
  searchParams: { page?: string; };
}

export default async function HomePage({ searchParams }: Props) {
  // Предзагрузка данных на сервере
  const page = Number(searchParams.page) || 1;
  await api.coin.getTop100Coins.prefetch({
    page,
    perPage: 10,
  });

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
