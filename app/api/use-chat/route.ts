import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { weatherTools } from "../tools/weather-tools";

export const maxDuration = 30;

const systemPrompt =
  "你是一個樂於助人的助手，回答關於特定城市天氣的問題。" +
  "你應該使用 showWeatherInformation 工具向用戶展示天氣信息，而不是直接描述天氣。" +
  "請始終使用英文作為 getWeatherInformation 的參數。" +
  "最後要回答給用戶時，請都使用繁體中文。";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    toolCallStreaming: true,
    system: systemPrompt,
    tools: weatherTools,
  });

  return result.toDataStreamResponse();
}
