import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { weatherTools } from "../tools/weather-tools";
import { systemPrompt } from "@/prompts";
import { currencyTool } from "../tools/currency-tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
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
