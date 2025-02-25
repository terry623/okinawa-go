"use client";

import { ToolInvocation } from "ai";
import { Message, useChat } from "@ai-sdk/react";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    status,
    reload,
    stop,
  } = useChat({
    api: "/api/use-chat",
    maxSteps: 5,
    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "showWeatherInformation") {
        // display tool. add tool result that informs the llm that the tool was executed.
        return "Weather information was shown to the user.";
      }
    },
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages?.map((m: Message) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
            const { toolCallId, args } = toolInvocation;

            // render display weather tool calls:
            if (toolInvocation.toolName === "showWeatherInformation") {
              return (
                <div
                  key={toolCallId}
                  className="p-4 my-2 text-gray-500 border border-gray-300 rounded"
                >
                  <h4 className="mb-2">{args?.city ?? ""}</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      {args?.weather && <b>{args.weather}</b>}
                      {args?.temperature && <b>{args.temperature} &deg;C</b>}
                    </div>
                    {args?.typicalWeather && <div>{args.typicalWeather}</div>}
                  </div>
                </div>
              );
            }
          })}
        </div>
      ))}

      {(status === "submitted" || status === "streaming") && (
        <div className="mt-4 text-gray-500">
          {status === "submitted" && <div>Loading...</div>}
        </div>
      )}

      {error && (
        <div className="mt-4">
          <div className="text-red-500">An error occurred.</div>
          <button
            type="button"
            className="px-4 py-2 mt-4 text-blue-500 border border-blue-500 rounded-md"
            onClick={() => reload()}
          >
            Retry
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          disabled={status !== "ready"}
        />
      </form>
    </div>
  );
}
