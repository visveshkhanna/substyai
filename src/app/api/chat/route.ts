import {
  addCalendarEvent,
  listCalendarEvents,
  deleteCalendarEvent,
} from "@/app/lib/calender";

import { ChatOpenAI } from "@langchain/openai";

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { AgentPrompt } from "@/app/lib/prompt";
import { getTodayDate } from "@/app/lib/calender";

import { LangChainAdapter } from "ai";

const openrouter = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  model: "google/gemini-2.0-flash-001",
});

const tools = [
  addCalendarEvent,
  listCalendarEvents,
  deleteCalendarEvent,
  getTodayDate,
];

const agent = createReactAgent({
  llm: openrouter,
  tools: tools,
  prompt: AgentPrompt,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = agent.streamEvents(
    { messages },
    {
      version: "v2",
    }
  );

  return LangChainAdapter.toDataStreamResponse(response);
}
