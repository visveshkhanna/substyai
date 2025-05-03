"use client";

import type { UIMessage } from "ai";

import { memo } from "react";

import equal from "fast-deep-equal";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "lucide-react";
import { ToolOutput } from "./tool-output";

const PurePreviewMessage = ({ message }: { message: UIMessage }) => {
  return (
    <div
      className={cn(
        "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:w-fit"
      )}
    >
      {message.role === "assistant" && (
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
          <div className="translate-y-px">
            <SparklesIcon size={14} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full">
        {message.parts?.map((part, index) => {
          const { type } = part;
          const key = `message-${message.id}-part-${index}`;

          console.log(part);

          if (type === "text") {
            return (
              <div
                key={key}
                className={cn("flex flex-row gap-2 items-start", {
                  "flex-row-reverse": message.role === "user",
                })}
              >
                <div
                  data-testid="message-content"
                  className={cn("flex flex-col gap-4", {
                    "bg-primary text-primary-foreground px-3 py-2 rounded-xl":
                      message.role === "user",
                  })}
                >
                  <p>{part.text}</p>
                </div>
              </div>
            );
          }

          if (type === "tool-invocation") {
            const { toolInvocation } = part;
            const { toolName, toolCallId, state } = toolInvocation;

            if (state === "call") {
              const {} = toolInvocation;

              return (
                <div key={toolCallId}>
                  <ToolOutput toolName={toolName} loading={true} />
                </div>
              );
            }

            if (state === "result") {
              const { result } = toolInvocation;

              return (
                <div key={toolCallId}>
                  <ToolOutput toolName={toolName} result={result} />
                </div>
              );
            }
          }
        })}
      </div>
    </div>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

    return true;
  }
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message "
      data-role={role}
    >
      <div
        className={cn(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </div>
  );
};
