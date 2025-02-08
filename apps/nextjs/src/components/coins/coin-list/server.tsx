import { api } from "~/trpc/server";
import { CoinListClient } from "./client";

const ITEMS_PER_PAGE = 10;

interface Props {
  page?: number;
}

export async function CoinListServer({ page = 1 }: Props) {
  const data = await api.coin.getTop100Coins({
    page,
    perPage: ITEMS_PER_PAGE,
  });

  return (
    <CoinListClient
      initialData={data}
      currentPage={page}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  );
}
