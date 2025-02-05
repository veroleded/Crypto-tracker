import type { CoinDetails } from "@acme/api/";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

interface Props {
  coin: CoinDetails;
}

export function CoinDescription({ coin }: Props) {
  if (!coin.description?.en) return null;

  return (
    <section aria-label="About">
      <Card>
        <CardHeader>
          <CardTitle>About {coin.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: coin.description.en }}
          />
        </CardContent>
      </Card>
    </section>
  );
}
