import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { weatherTools } from "@/tools/weather-tools";
import { currencyTool } from "@/tools/currency-tools";
import { systemPrompt } from "@/prompts";

export const maxDuration = 30;

const api_model = "gpt-4o-mini";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai(api_model),
    messages,
    toolCallStreaming: true,
    system: systemPrompt,
    tools: {
      ...weatherTools,
      ...currencyTool,
    },
  });

  return result.toDataStreamResponse();
}
