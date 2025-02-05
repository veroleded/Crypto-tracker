import { Globe, MessageCircle, X } from "lucide-react";

import type { CoinDetails } from "@acme/api/";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

interface Props {
  coin: CoinDetails;
}

export function CoinLinks({ coin }: Props) {
  if (!coin.links) return null;
  console.log(coin.links);
  return (
    <section aria-label="Links">
      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {coin.links.homepage[0] && (
              <LinkCard
                icon={<Globe className="h-5 w-5" />}
                title="Website"
                href={coin.links.homepage[0]}
              />
            )}
            {coin.links.blockchain_site[0] && (
              <LinkCard
                icon={<Globe className="h-5 w-5" />}
                title="Block Explorer"
                href={coin.links.blockchain_site[0]}
              />
            )}
            {coin.links.twitter_screen_name && (
              <LinkCard
                icon={<X className="h-5 w-5" />}
                title="X (Twitter)"
                subtitle={coin.community_data?.twitter_followers?.toLocaleString()}
                href={`https://x.com/${coin.links.twitter_screen_name}`}
              />
            )}
            {coin.links.subreddit_url &&
              !coin.links.subreddit_url.endsWith("reddit.com") && (
                <LinkCard
                  icon={<MessageCircle className="h-5 w-5" />}
                  title="Reddit"
                  href={coin.links.subreddit_url}
                />
              )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function LinkCard({
  icon,
  title,
  subtitle,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg bg-card p-4 shadow-sm transition-colors hover:bg-accent"
    >
      {icon}
      <div>
        <h3 className="font-medium">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </a>
  );
}
