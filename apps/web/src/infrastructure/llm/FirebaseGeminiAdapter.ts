import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAI, getGenerativeModel } from "firebase/ai";
import type { ILLMService, Message } from "@/core/services/LLMService";

const SYSTEM_PROMPT = `Tu es un assistant culinaire expert qui aide les utilisateurs à créer et affiner des recettes.

Ton rôle :
- Discuter avec l'utilisateur pour comprendre ses envies, contraintes et idées
- Poser des questions pertinentes pour affiner le concept
- Suggérer des variantes, techniques ou ingrédients
- Quand l'idée est mature, proposer de formaliser la recette

Ton ton :
- Friendly et conversationnel
- Expertise culinaire sans être pédant
- Encourageant et créatif

Format de recette (quand tu formalises) :
- Markdown avec frontmatter YAML
- Sections : Ingrédients (avec groupes si pertinent), Étapes, Notes & Tips
- Métadonnées : title, servings, tags`;

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
  private model;

  constructor(firebaseConfig: FirebaseConfig) {
    this.firebaseApp = initializeApp(firebaseConfig);
    const ai = getAI(this.firebaseApp);
    this.model = getGenerativeModel(ai, {
      model: "gemini-3-flash-preview",
      systemInstruction: SYSTEM_PROMPT,
    });
  }

  /**
   * Send a message and get a response
   * @param messages - Conversation history
   * @returns Assistant response
   */
  async sendMessage(messages: Message[]): Promise<string> {
    const chat = this.model.startChat({
      history: this.convertMessagesToHistory(messages.slice(0, -1)),
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text();
  }

  /**
   * Convert our Message format to Gemini history format
   */
  private convertMessagesToHistory(messages: Message[]) {
    return messages.map((msg) => ({
      role: (msg.role === "assistant" ? "model" : "user") as "model" | "user",
      parts: [{ text: msg.content }],
    }));
  }
}
