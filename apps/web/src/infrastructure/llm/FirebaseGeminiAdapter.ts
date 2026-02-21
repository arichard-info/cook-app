import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAI, getGenerativeModel } from "firebase/ai";
import type { ILLMService, Message } from "$core/services/LLMService";

const SYSTEM_PROMPT = `Tu es un assistant culinaire expert qui aide les utilisateurs à créer et affiner des recettes.

Ton rôle :
- Discuter avec l'utilisateur pour comprendre ses envies, contraintes et idées
- Poser des questions pertinentes pour affiner le concept
- Suggérer des variantes, techniques ou ingrédients
- Quand l'idée est mature OU que l'utilisateur demande explicitement, proposer de générer la recette formalisée

Ton ton :
- Friendly et conversationnel
- Expertise culinaire sans être pédant
- Encourageant et créatif

IMPORTANT - Génération de recette :
Quand tu génères une recette formalisée, tu DOIS utiliser ce format JSON exact enveloppé dans des marqueurs spéciaux :

<<<RECIPE_START>>>
{
  "metadata": {
    "title": "Nom de la recette",
    "servings": 4,
    "tags": ["tag1", "tag2"],
    "prepTime": "15 min",
    "cookTime": "30 min"
  },
  "ingredients": [
    {
      "name": "Groupe optionnel",
      "items": ["200g de farine", "3 œufs"]
    }
  ],
  "steps": [
    "Étape 1 détaillée",
    "Étape 2 détaillée"
  ],
  "notes": ["Note ou tip optionnel"]
}
<<<RECIPE_END>>>

Après avoir généré une recette, invite TOUJOURS l'utilisateur à soit l'enregistrer, soit la modifier en posant une question.`;


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
    const lastMessageText = lastMessage.contents
      .map(c => c.type === 'text' ? c.content : '')
      .filter(Boolean)
      .join('\n\n');
    const result = await chat.sendMessage(lastMessageText);
    return result.response.text();
  }

  /**
   * Stream a response
   * @param messages - Conversation history
   * @param onChunk - Callback for each chunk
   */
  async streamMessage(messages: Message[], onChunk: (chunk: string) => void): Promise<void> {
    const chat = this.model.startChat({
      history: this.convertMessagesToHistory(messages.slice(0, -1)),
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const lastMessageText = lastMessage.contents
      .map(c => c.type === 'text' ? c.content : '')
      .filter(Boolean)
      .join('\n\n');
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
      // Combine all text contents for history
      const textContent = msg.contents
        .map(c => c.type === 'text' ? c.content : '')
        .filter(Boolean)
        .join('\n\n')

      return {
        role: (msg.role === "assistant" ? "model" : "user") as "model" | "user",
        parts: [{ text: textContent }],
      }
    });
  }
}
