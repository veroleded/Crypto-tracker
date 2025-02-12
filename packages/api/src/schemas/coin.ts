import { z } from "zod";

export const coinSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  current_price: z.number().nullable(),
  price_change_percentage_24h: z.number().nullable(),
  image: z.string(),
  market_cap_rank: z.number().nullable(),
  market_cap: z.number().nullable(),
  total_volume: z.number().nullable(),
  high_24h: z.number().nullable(),
  low_24h: z.number().nullable(),
  circulating_supply: z.number().nullable(),
  total_supply: z.number().nullable(),
  max_supply: z.number().nullable(),
  ath: z.number().nullable(),
  atl: z.number().nullable(),
}).passthrough();

export const coinDetailsSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  description: z.object({
    en: z.string(),
  }).nullable(),
  image: z.object({
    large: z.string(),
    small: z.string(),
    thumb: z.string(),
  }),
  market_data: z.object({
    current_price: z.object({
      usd: z.number(),
    }),
    market_cap_rank: z.number(),
    market_cap: z.object({
      usd: z.number(),
    }),
    total_volume: z.object({
      usd: z.number(),
    }),
    high_24h: z.object({
      usd: z.number(),
    }),
    low_24h: z.object({
      usd: z.number(),
    }),
    price_change_percentage_24h: z.number().optional(),
    price_change_percentage_7d: z.number().optional(),
    price_change_percentage_30d: z.number().optional(),
    price_change_percentage_1y: z.number().optional(),
    circulating_supply: z.number(),
    total_supply: z.number().nullable(),
    max_supply: z.number().nullable(),
    ath: z.object({
      usd: z.number(),
    }),
    ath_date: z.object({
      usd: z.string(),
    }),
    atl: z.object({
      usd: z.number(),
    }),
    atl_date: z.object({
      usd: z.string(),
    }),
  }),
  links: z.object({
    homepage: z.array(z.string()),
    blockchain_site: z.array(z.string()),
    official_forum_url: z.array(z.string()),
    twitter_screen_name: z.string().nullable(),
    telegram_channel_identifier: z.string().nullable(),
    subreddit_url: z.string().nullable(),
  }).nullable(),
  genesis_date: z.string().nullable(),
  community_data: z.object({
    twitter_followers: z.number().nullable(),
    reddit_subscribers: z.number().nullable(),
  }).nullable().optional(),
  developer_data: z.object({
    forks: z.number().nullable(),
    stars: z.number().nullable(),
    subscribers: z.number().nullable(),
  }).nullable().optional(),
}).passthrough();

export const marketChartSchema = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])),
  market_caps: z.array(z.tuple([z.number(), z.number()])),
  total_volumes: z.array(z.tuple([z.number(), z.number()])),
});

export type Coin = z.infer<typeof coinSchema>;
export type CoinDetails = z.infer<typeof coinDetailsSchema>;
export type MarketChart = z.infer<typeof marketChartSchema>; 