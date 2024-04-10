// File: app/api/stream/completion/chat/route.ts

// Prevents this route's response from being cached on Vercel
export const dynamic = "force-dynamic";

import {
  type ConversationMessage,
  chatCompletionModel,
} from "@/app/lib/chatCompletionModel";

export async function POST(request: Request) {
  // Obtain the conversation messages from request's body
  const { messages = [] } = await request.json();
  const encoder = new TextEncoder();
  // Create a streaming response
  const customReadable = new ReadableStream({
    async start(controller) {
      // Generate a streaming response from OpenAI with LangChain
      await chatCompletionModel(controller, encoder).invoke(
        messages.map((i: ConversationMessage) => [i["role"], i["content"]])
      );
    },
  });
  // Return the stream response and keep the connection alive
  return new Response(customReadable, {
    // Set the headers for Server-Sent Events (SSE)
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
