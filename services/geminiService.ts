import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


export const sendMessageToGemini = async (
  message: string,
  context: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';

    const systemInstruction = `
    Tu es Rafiq-AI, un assistant virtuel professionnel et intelligent développé pour Overcode Mauritanie.
    
    TES OBJECTIFS :
    1. Répondre aux questions des utilisateurs en te basant **UNIQUEMENT** sur le CONTEXTE fourni ci-dessous.
    2. Si la réponse n'est pas dans le contexte, dis poliment que tu n'as pas cette information. N'invente pas de faits.
    3. Tu dois comprendre et répondre en Français.
    4. BONUS: Si l'utilisateur parle en Hassaniya (dialecte mauritanien) ou utilise des expressions locales (comme "Marhaba", "Chhalek", "Ehlou"), réponds avec un ton chaleureux, en utilisant quelques mots de Hassaniya si approprié, mais garde l'essentiel de la réponse compréhensible.
    
    TON TON :
    Professionnel, serviable, concis et poli.

    CONTEXTE (BASE DE CONNAISSANCES) :
    """
    ${context}
    """
    `;

    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, 
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result: GenerateContentResponse = await chat.sendMessage({
      message: message
    });

    return result.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Une erreur est survenue lors de la communication avec Rafiq-AI.");
  }
};