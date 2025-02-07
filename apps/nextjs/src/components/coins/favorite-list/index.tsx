import { api } from "~/trpc/server";
import { CoinItem } from "../coin-list/coin-item";

export async function FavoriteList() {
  // Получаем все избранные ID
  const { favorites } = await api.favorite.getAll();
  const ids = favorites.map((v: { coinId: string; }) => v.coinId);

  // Получаем данные для всех избранных монет
  const { coins } = await api.coin.getByIds({
    ids
  });

  if (!coins.length) {
    return (
      <div className="text-center text-muted-foreground">
        You haven't added any coins to favorites yet
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1920px] space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4">
        {coins.map((coin) => (
          <CoinItem key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  );
} 