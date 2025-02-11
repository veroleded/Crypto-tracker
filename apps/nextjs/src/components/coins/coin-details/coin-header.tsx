import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import type { CoinDetails } from "@acme/api";
import { Button } from "@acme/ui/button";

import { FavoriteButton } from "../favorite-button";

interface Props {
  coin: CoinDetails;
}

export function CoinHeader({ coin }: Props) {
  const router = useRouter();

  const coinInfo = useMemo(
    () => ({
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      image: coin.image.large,
    }),
    [coin.name, coin.symbol, coin.image.large],
  );

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => router.back()}
          aria-label="Go back to previous page"
        >
          <div className="flex h-10 w-10 items-center justify-center">
            <ChevronLeft className="h-6 w-6" />
          </div>
        </Button>

        <Image
          src={coinInfo.image}
          alt={coinInfo.name}
          width={32}
          height={32}
          className="h-8 w-8"
          priority
        />

        <div>
          <h1 className="text-xl font-bold">{coinInfo.name}</h1>
          <p className="text-sm text-muted-foreground">{coinInfo.symbol}</p>
        </div>
      </div>

      <FavoriteButton coinId={coin.id} />
    </div>
  );
}
