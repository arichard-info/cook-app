import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAI, getGenerativeModel } from "firebase/ai";
import type { ILLMService, Message } from "$core/services/LLMService";

interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

/**
 * Firebase Gemini adapter for LLM service using Firebase AI Logic
 */
export class FirebaseGeminiAdapter implements ILLMService {
  private firebaseApp: FirebaseApp;

  constructor(firebaseConfig: FirebaseConfig) {
    this.firebaseApp = initializeApp(firebaseConfig);
  }

  /**
   * Send a message and get a response
   * @param messages - Conversation history
   * @param systemPrompt - System prompt defining the conversation behavior
   * @returns Assistant response
   */
  async sendMessage(messages: Message[], systemPrompt: string): Promise<string> {
    const ai = getAI(this.firebaseApp);
    const model = getGenerativeModel(ai, {
      model: "gemini-2.0-flash-preview",
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history: this.convertMessagesToHistory(messages.slice(0, -1)),
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const lastMessageText = lastMessage.contents
      .map((c) => (c.type === "text" ? c.content : ""))
      .filter(Boolean)
      .join("\n\n");
    const result = await chat.sendMessage(lastMessageText);
    return result.response.text();
  }

  /**
   * Stream a response
   * @param messages - Conversation history
   * @param onChunk - Callback for each chunk
   * @param systemPrompt - System prompt defining the conversation behavior
   */
  async streamMessage(
    messages: Message[],
    onChunk: (chunk: string) => void,
    systemPrompt: string,
  ): Promise<void> {
    const ai = getAI(this.firebaseApp);
    const model = getGenerativeModel(ai, {
      model: "gemini-2.0-flash-preview",
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history: this.convertMessagesToHistory(messages.slice(0, -1)),
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const lastMessageText = lastMessage.contents
      .map((c) => (c.type === "text" ? c.content : ""))
      .filter(Boolean)
      .join("\n\n");
    const result = await chat.sendMessageStream(lastMessageText);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      onChunk(text);
    }
  }

  /**
   * Convert our Message format to Gemini history format
   */
  private convertMessagesToHistory(messages: Message[]) {
    return messages.map((msg) => {
      const textContent = msg.contents
        .map((c) => (c.type === "text" ? c.content : ""))
        .filter(Boolean)
        .join("\n\n");

      return {
        role: (msg.role === "assistant" ? "model" : "user") as "model" | "user",
        parts: [{ text: textContent }],
      };
    });
  }
}
