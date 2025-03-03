import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { weatherTools } from "@/tools/weather-tools";
import { currencyTool } from "@/tools/currency-tools";
import { hackmdTools } from "@/tools/hackmd-tools";
import { systemPrompt } from "@/prompts";
import { apiModel } from "@/constants";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai(apiModel),
    messages,
    toolCallStreaming: true,
    system: systemPrompt,
    tools: {
      ...weatherTools,
      ...currencyTool,
      ...hackmdTools,
    },
  });

  return result.toDataStreamResponse();
}
