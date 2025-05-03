"use client";

import { useChat } from "@ai-sdk/react";
import { Textarea } from "@/app/components/ui/text-area";
import { ArrowUp } from "lucide-react";
import { cn } from "../lib/utils";
import { Messages } from "../components/messages";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    onResponse(response) {},
  });
  return (
    <div className="flex flex-col h-dvh">
      <div className="flex-1 flex flex-col justify-center">
        {messages.length === 0 ? (
          <>
            <div></div>
            <div className="flex flex-col text-xl">
              <p className="font-semibold">Hello there!</p>
              <p className="text-muted-foreground">
                How can Chrono help you today?
              </p>
            </div>
          </>
        ) : (
          <Messages messages={messages} status={status} />
        )}
      </div>
      <div className="flex flex-col relative">
        <Textarea
          placeholder="Send a message..."
          className="bg-secondary rounded-xl pr-8"
          rows={4}
          style={{ resize: "none" }}
          value={input}
          onChange={handleInputChange}
        />
        <button
          className={cn(
            "absolute bg-primary/40 hover:bg-primary transition-all rounded-full p-1 right-2 bottom-2",
            {
              "bg-primary": input.length > 0,
            }
          )}
          disabled={input.length === 0}
          onClick={handleSubmit}
        >
          <ArrowUp size={20} color="black" />
        </button>
      </div>
    </div>
  );
}
