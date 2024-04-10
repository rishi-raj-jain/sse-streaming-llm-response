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
    streaming: true,
    temperature: 0.9,
    callbacks: [
      {
        handleLLMNewToken(token) {
          controller.enqueue(encoder.encode(`data: ${token}\n\n`));
        },
        async handleLLMEnd(output) {
          console.log(output.generations[0][0].text);
          controller.close();
        },
      },
    ],
  });
