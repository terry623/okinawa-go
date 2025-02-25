import { ToolSet } from "ai";
import { z } from "zod";

const apiKey = process.env.WEATHER_API_KEY;
const apiBaseUrl = "http://api.weatherapi.com/v1/current.json";

export const weatherTools: ToolSet = {
  // server-side tool with execute function:
  getWeatherInformation: {
    description: "向用戶展示指定城市的天氣",
    parameters: z.object({ city: z.string() }),
    execute: async ({ city }: { city: string }) => {
      try {
        if (!apiKey) {
          throw new Error("Weather API key is not configured");
        }

        const url = new URL(apiBaseUrl);
        url.searchParams.append("key", apiKey);
        url.searchParams.append("q", city);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
          weather: data.current.condition.text,
          temperature: Math.round(data.current.temp_c),
        };
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return {
          weather: "Unknown",
          temperature: 0,
          error: "Could not fetch weather data",
        };
      }
    },
  },
  // client-side tool that displays whether information to the user:
  showWeatherInformation: {
    description: "向用戶展示天氣信息。始終使用此工具告知用戶天氣信息。",
    parameters: z.object({
      city: z.string(),
      weather: z.string(),
      temperature: z.number(),
      typicalWeather: z
        .string()
        .describe(
          "用繁體中文（非簡體中文）撰寫 2-3 句關於該城市典型天氣的描述。"
        ),
    }),
  },
};
