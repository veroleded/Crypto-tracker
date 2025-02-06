import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import type { Coin } from "@acme/api";

interface Props {
  coin: Coin;
}

export function CoinItem({ coin }: Props) {
  return (
    <Link
      href={`/coins/${coin.id}`}
      key={coin.id}
      className="flex w-full items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={coin.image}
          alt={coin.name}
          className="h-8 w-8 shrink-0"
          width={32}
          height={32}
        />
        <div className="min-w-0">
          <div className="line-clamp-1 font-medium">{coin.name}</div>
          <div className="text-sm text-muted-foreground">
            {coin.symbol.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="font-medium">
          ${coin.current_price.toLocaleString()}
        </div>
        <div
          className={clsx(
            "text-sm",
            coin.price_change_percentage_24h > 0
              ? "text-green-500"
              : "text-red-500",
          )}
        >
          {coin.price_change_percentage_24h > 0 ? "+" : ""}
          {coin.price_change_percentage_24h.toFixed(2)}%
        </div>
      </div>
    </Link>
  );
}
