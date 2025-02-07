import { notFound } from "next/navigation";

import { CoinDetails } from "~/components/coins/coin-details";
import { api } from "~/trpc/server";

interface Props {
  params: {
    id: string;
  };
}

export default async function CoinPage({ params }: Props) {
  const coin = await api.coin.getDetailsById(params.id);

  if (!coin) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <CoinDetails coin={coin} />
    </div>
  );
}
