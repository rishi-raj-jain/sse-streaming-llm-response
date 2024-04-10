import { OpenAI } from "@langchain/openai";

export const completionModel = (
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) =>
  new OpenAI({
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
