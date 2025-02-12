import { Globe, MessageCircle, X } from "lucide-react";
import { useMemo } from "react";

import type { CoinDetails } from "@acme/api";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

interface LinkCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  href: string;
}

function LinkCard({ icon, title, subtitle, href }: LinkCardProps) {
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

interface Props {
  coin: CoinDetails;
}

export function CoinLinks({ coin }: Props) {
  const links = useMemo(() => {
    if (!coin.links) return [];

    const items = [];

    const { links: coinLinks, community_data: communityData } = coin;

    if (coinLinks.homepage[0]) {
      items.push({
        key: "website",
        icon: <Globe className="h-5 w-5" />,
        title: "Website",
        href: coinLinks.homepage[0],
      });
    }

    if (coinLinks.blockchain_site[0]) {
      items.push({
        key: "explorer",
        icon: <Globe className="h-5 w-5" />,
        title: "Block Explorer",
        href: coinLinks.blockchain_site[0],
      });
    }

    if (coinLinks.twitter_screen_name) {
      items.push({
        key: "twitter",
        icon: <X className="h-5 w-5" />,
        title: "X (Twitter)",
        subtitle: communityData?.twitter_followers?.toLocaleString(),
        href: `https://x.com/${coinLinks.twitter_screen_name}`,
      });
    }

    if (
      coinLinks.subreddit_url &&
      !coinLinks.subreddit_url.endsWith("reddit.com")
    ) {
      items.push({
        key: "reddit",
        icon: <MessageCircle className="h-5 w-5" />,
        title: "Reddit",
        href: coinLinks.subreddit_url,
      });
    }

    return items;
  }, [coin]);

  if (!coin.links || links.length === 0) return null;

  return (
    <section aria-label="Links">
      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {links.map((link) => (
              <LinkCard
                key={link.key}
                icon={link.icon}
                title={link.title}
                subtitle={link.subtitle}
                href={link.href}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
