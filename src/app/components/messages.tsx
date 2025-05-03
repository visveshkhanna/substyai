import type { UIMessage } from "ai";
import { PreviewMessage, ThinkingMessage } from "./message";
import { AIMessage } from "@langchain/core/messages";

import { memo } from "react";

import equal from "fast-deep-equal";
import { useScrollToBottom } from "./use-scroll-bottom";
import type { UseChatHelpers } from "@ai-sdk/react";

interface MessagesProps {
  status: UseChatHelpers["status"];
  messages: Array<UIMessage>;
}

function PureMessages({ messages, status }: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {messages.map((message) => (
        <PreviewMessage key={message.id} message={message} />
      ))}

      {status === "submitted" &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && <ThinkingMessage />}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return true;
});
