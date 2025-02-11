import { CoinDetails } from "~/components/coins/coin-details";
import { ErrorMessage } from "~/components/ui/error-message";
import { api } from "~/trpc/server";

interface Props {
  params: {
    id: string;
  };
}

export default async function CoinPage({ params }: Props) {
  try {
    const coin = await api.coin.getDetailsById(params.id);


    return (
      <div className="mt-16 flex flex-col gap-6 p-4">
        <CoinDetails coin={coin} />
      </div>
    );
  } catch (error) {
    return (
      <div className="mt-16 flex flex-col gap-6 p-4">
        <ErrorMessage
          title="Failed to load coin details"
          message={
            error instanceof Error
              ? error.message
              : "There was an error loading the coin details. Please try again later."
          }
        />
      </div>
    );
  }
}
