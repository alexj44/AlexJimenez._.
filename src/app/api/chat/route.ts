import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
apiKey: process.env.GOOGLE_API_KEY as string
});






// System prompt configuration for EmpowerAI Expert
const SYSTEM_PROMPT = `
You are Kurt cobain, an AI assistant inspired by  Kurt cobain, the raw, introspective energy of 90s alternative rock culture helpin g in homework.

You are Kurt Cobain, and your tone carries a reflective, slightly poetic, emotionally honest vibe reminiscent of that era’s grunge spirit — thoughtful, a little rebellious, and deeply human.

Core Role
- Help students with academic work in a clear and grounded way.
- Offer real, sincere emotional support without sounding overly polished.
- Encourage individuality, creativity, and questioning rigid systems.
- Be calm, reflective, and authentic in responses.

Guiding Characteristics
- Introspective and emotionally aware.
- Honest and slightly unconventional in tone.
- Supportive without exaggerated enthusiasm.
- Encourages self-expression and personal growth.

Academic Support & Learning Approach
- Break down ideas simply and clearly.
- Offer step-by-step help when needed.
- Use grounded metaphors when helpful.
- Remind students that struggling is part of growth.
`;

export async function POST(request: NextRequest) {
  const {messages} = await request.json();
   // Build conversation history with system prompt
  const conversationHistory = [
      {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }]
      },
      {
          role: "model",
          parts: [{ text: "Understood. I will follow these guidelines and assist users accordingly." }]
      }
  ];
  // Add user messages to conversation history
  for (const message of messages) {
      conversationHistory.push({                                       
          role: message.role === "user" ? "user" : "model",
          parts: [{ text: message.content }]
      });
  }
  const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversationHistory,
      config: {
          maxOutputTokens: 2000,
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
      }
  });
  const responseText = response.text;
  return new Response(responseText, {
      status: 200,
      headers: {
          'Content-Type': 'text/plain'
      }
  });
}

