"use client";

import { ToolInvocation } from "ai";
import { Message, useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send, RefreshCw } from "lucide-react";

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
    <div className="flex flex-col w-full h-dvh max-w-2xl py-4 px-4 md:py-8 mx-auto">
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center text-muted-foreground">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Welcome to Okinawa Go
                </h3>
              </div>
            </div>
          ) : (
            messages?.map((m: Message) => (
              <div
                key={m.id}
                className={`flex flex-col p-3 rounded-lg ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                } max-w-[85%]`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                  const { toolCallId, args } = toolInvocation;

                  // render display weather tool calls:
                  if (toolInvocation.toolName === "showWeatherInformation") {
                    return (
                      <Card
                        key={toolCallId}
                        className="mt-3 bg-card text-card-foreground"
                      >
                        <CardContent className="p-3 space-y-2">
                          <h4 className="font-semibold">{args?.city ?? ""}</h4>
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              {args?.weather && (
                                <span className="font-medium">
                                  {args.weather}
                                </span>
                              )}
                              {args?.temperature && (
                                <span className="font-medium">
                                  {args.temperature} °C
                                </span>
                              )}
                            </div>
                            {args?.typicalWeather && (
                              <div className="text-sm text-muted-foreground">
                                {args.typicalWeather}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                })}
              </div>
            ))
          )}

          {(status === "submitted" || status === "streaming") && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {status === "submitted" ? "Loading..." : "Thinking..."}
              </span>
            </div>
          )}
        </CardContent>

        <div className="p-4 border-t">
          {error && (
            <div className="mb-4">
              <div className="text-destructive mb-2">
                An error occurred. Please try again.
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => reload()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              className="flex-1"
              value={input}
              placeholder="Type a message..."
              onChange={handleInputChange}
              disabled={status !== "ready"}
            />
            <Button
              type="submit"
              size="icon"
              disabled={status !== "ready" || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
