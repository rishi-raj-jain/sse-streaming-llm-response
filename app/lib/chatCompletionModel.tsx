import cache from '@/app/lib/upstashCache';
import { ChatOpenAI } from "@langchain/openai";

export type ConversationMessage = {
  role: string;
  content: string;
};

export type ConversationMessages = ConversationMessage[];

export const chatCompletionModel = (
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) =>
  new ChatOpenAI({
    cache,
    streaming: true,
    temperature: 0.9,
    callbacks: [
      {
        handleLLMNewToken(token) {
          controller.enqueue(encoder.encode(token));
        },
        async handleLLMEnd(output) {
          console.log(output.generations[0][0].text);
          controller.close();
        },
      },
    ],
  });
