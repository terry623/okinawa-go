import { ToolSet } from "ai";
import { z } from "zod";

const apiKey = process.env.EXCHANGE_RATE_API_KEY;
const apiBaseUrl = "https://v6.exchangerate-api.com/v6";

const currencySchema = z.object({
  from: z.string().length(3),
  to: z.string().length(3),
});

export const exchangeRateToolPrompt =
  "當用戶詢問匯率時，你應該使用 getCurrentExchangeRate 工具獲取最新匯率信息。" +
  "請始終使用英文作為 getCurrentExchangeRate 的參數。";

export async function getCurrentExchangeRate(from: string, to: string) {
  if (!apiKey) {
    throw new Error("Currency API key is not configured");
  }

  const response = await fetch(`${apiBaseUrl}/${apiKey}/latest/${from}`);

  if (!response.ok) {
    throw new Error(`Currency API error: ${response.statusText}`);
  }

  const data = await response.json();

  return data.conversion_rates[to];
}

export const currencyTool: ToolSet = {
  getCurrentExchangeRate: {
    description: "獲取即時匯率信息。請提供源幣種(from)和目標幣種(to)。",
    parameters: currencySchema,
    execute: async ({ from, to }: z.infer<typeof currencySchema>) => {
      const rate = await getCurrentExchangeRate(from, to);
      return `${from} 對 ${to} 的當前匯率是 ${rate}`;
    },
  },
};
