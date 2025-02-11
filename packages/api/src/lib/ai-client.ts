import { z } from "zod";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

const API_URL = "https://api.proxyapi.ru/deepseek";

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

async function makeRequest(endpoint: string, body: unknown): Promise<ChatCompletionResponse> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    });

    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = await response.text();
    }

    console.error('Error details:', errorData);
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data as ChatCompletionResponse;
}

const priceAnalysisSchema = z.object({
  trend: z.enum(["bullish", "bearish", "neutral"]),
  confidence: z.number().min(0).max(1),
  support: z.number(),
  resistance: z.number(),
  prediction: z.object({
    price: z.number(),
    timeframe: z.string(),
    probability: z.number().min(0).max(1),
  }),
  technicalIndicators: z.array(z.object({
    name: z.string(),
    value: z.string(),
    signal: z.enum(["buy", "sell", "hold"]),
  })),
});

const newsAnalysisSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  score: z.number().min(-1).max(1),
  summary: z.string(),
  keyEvents: z.array(z.object({
    title: z.string(),
    impact: z.enum(["high", "medium", "low"]),
    sentiment: z.enum(["positive", "negative", "neutral"]),
  })),
});

export type PriceAnalysis = z.infer<typeof priceAnalysisSchema>;
export type NewsAnalysis = z.infer<typeof newsAnalysisSchema>;

export async function analyzePriceData(data: {
  prices: [number, number][];
  marketCap: [number, number][];
  volume: [number, number][];
  timeframe: string;
}): Promise<PriceAnalysis> {
  const formattedPrices = data.prices
    .map(([timestamp, price]) => ({
      date: new Date(timestamp).toISOString(),
      price,
    }))
    .slice(-50)
    .map(({ date, price }) => `${date}: $${price.toLocaleString()}`);

  const prompt = `Analyze the following cryptocurrency data:
Historical Prices (last 50 points):
${formattedPrices.join("\n")}

Market Cap: $${data.marketCap[data.marketCap.length - 1]?.[1].toLocaleString()}
Volume: $${data.volume[data.volume.length - 1]?.[1].toLocaleString()}
Timeframe: ${data.timeframe}

Provide technical analysis with:
1. Current trend (bullish/bearish/neutral)
2. Support and resistance levels
3. Technical indicators analysis
4. Price prediction for the specified timeframe

Format as JSON:
{
  "trend": "bullish" | "bearish" | "neutral",
  "confidence": number (0-1),
  "support": number,
  "resistance": number,
  "prediction": {
    "price": number,
    "timeframe": string,
    "probability": number (0-1)
  },
  "technicalIndicators": [
    {
      "name": string,
      "value": string,
      "signal": "buy" | "sell" | "hold"
    }
  ]
}`;

  try {
    const requestBody = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a cryptocurrency market analyst. Analyze the data and return insights in the specified JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
      temperature: 0.3
    };

    console.log('Sending request with body:', requestBody);

    const response = await makeRequest('/chat/completions', requestBody);

    console.log('Received response:', response);

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No content in response");
    }

    const parsedResult = JSON.parse(result);
    return priceAnalysisSchema.parse(parsedResult);
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
}

export async function analyzeNewsData(newsData: {
  description: string;
  category: string;
  created_at: string;
}[]): Promise<NewsAnalysis> {
  const formattedNews = newsData
    .map(
      (item) =>
        `[${item.category}] ${new Date(item.created_at).toISOString()}: ${item.description}`,
    )
    .join("\n\n");

  const prompt = `Analyze these cryptocurrency news updates:
${formattedNews}

Provide analysis with:
1. Overall sentiment
2. Key events and their impact
3. Summary of the news

Format as JSON:
{
  "sentiment": "positive" | "negative" | "neutral",
  "score": number (-1 to 1),
  "summary": string,
  "keyEvents": [
    {
      "title": string,
      "impact": "high" | "medium" | "low",
      "sentiment": "positive" | "negative" | "neutral"
    }
  ]
}`;

  try {
    const requestBody = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a cryptocurrency news analyst. Analyze the news and return insights in the specified JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
      temperature: 0.3
    };

    const response = await makeRequest('/chat/completions', requestBody);
    const result = response.choices[0]?.message?.content;

    if (!result) {
      throw new Error("No content in response");
    }

    const parsedResult = JSON.parse(result);
    return newsAnalysisSchema.parse(parsedResult);
  } catch (error) {
    console.error("News analysis failed:", error);
    throw error;
  }
} 