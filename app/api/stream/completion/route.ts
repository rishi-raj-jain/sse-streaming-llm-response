// File: app/api/stream/completion/route.ts

// Prevents this route's response from being cached on Vercel
export const dynamic = "force-dynamic";

import { completionModel } from "@/app/lib/completionModel";

export async function POST(request: Request) {
  // Obtain the user message from request's body
  const { message } = await request.json();
  const encoder = new TextEncoder();
  // Create a streaming response
  const customReadable = new ReadableStream({
    async start(controller) {
      // Generate a streaming response from OpenAI with LangChain
      await completionModel(controller, encoder).invoke(message);
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
