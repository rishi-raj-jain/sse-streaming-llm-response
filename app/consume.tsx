"use client";

import { useState } from "react";
import { ConversationMessages } from "./lib/chatCompletionModel";

export default function () {
  const [latestMessage, setLatestMessage] = useState<string>("");
  const [messages, setMessages] = useState<ConversationMessages>([]);

  const obtainAPIResponse = async (apiRoute: string, apiData: any) => {
    // Initiate the first call to connect to SSE API
    const apiResponse = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "text/event-stream",
      },
      body: JSON.stringify(apiData),
    });

    if (!apiResponse.body) return;

    // To recieve data as a string we use TextDecoderStream class in pipethrough
    const reader = apiResponse.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    let incomingMessage = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        setMessages((messages) => [
          ...messages,
          { role: "assistant", content: incomingMessage },
        ]);
        setLatestMessage("");
        break;
      }
      if (value) {
        incomingMessage += value;
        setLatestMessage(incomingMessage);
      }
    }
  };

  return <></>;
}
