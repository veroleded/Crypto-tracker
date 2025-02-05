import { CoinDetails } from "~/components/coins/coin-details";

interface Props {
  params: {
    id: string;
  };
}

export default function CoinPage({ params }: Props) {
  return (
    <div className="flex flex-col gap-6 p-4">
      <CoinDetails coinId={params.id} />
    </div>
  );
}
