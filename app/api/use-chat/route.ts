import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    toolCallStreaming: true,
    system:
      "You are a helpful assistant that answers questions about the weather in a given city." +
      "You use the showWeatherInformation tool to show the weather information to the user instead of talking about it.",
    tools: {
      // server-side tool with execute function:
      getWeatherInformation: {
        description: "show the weather in a given city to the user",
        parameters: z.object({ city: z.string() }),
        execute: async ({ city }: { city: string }) => {
          try {
            const apiKey = process.env.WEATHER_API_KEY;

            if (!apiKey) {
              throw new Error("Weather API key is not configured");
            }

            const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

            console.log(url);

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
        description:
          "Show the weather information to the user. Always use this tool to tell weather information to the user.",
        parameters: z.object({
          city: z.string(),
          weather: z.string(),
          temperature: z.number(),
          typicalWeather: z
            .string()
            .describe("2-3 sentences about the typical weather in the city."),
        }),
      },
    },
  });

  return result.toDataStreamResponse();
}
