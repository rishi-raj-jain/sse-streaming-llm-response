import { OpenAI } from "@langchain/openai";
import cache from '@/app/lib/upstashCache';

export const completionModel = (
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) =>
  new OpenAI({
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
