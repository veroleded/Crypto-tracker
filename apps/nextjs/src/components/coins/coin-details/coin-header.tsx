import Image from "next/image";
import { ChevronLeft } from "lucide-react";

import type { CoinDetails } from "@acme/api";
import { Button } from "@acme/ui/button";

interface Props {
  coin: CoinDetails;
}

export function CoinHeader({ coin }: Props) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" className="p-0" asChild>
        <a href="/" className="flex h-10 w-10 items-center justify-center">
          <ChevronLeft className="h-6 w-6" />
        </a>
      </Button>
      <Image
        src={coin.image.large}
        alt={coin.name}
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <div>
        <h1 className="text-xl font-bold">{coin.name}</h1>
        <p className="text-sm text-muted-foreground">
          {coin.symbol.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
