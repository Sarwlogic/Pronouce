
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function analyzePronunciation(targetWord: string, childsAttempt: string, childName: string): Promise<string> {
  if (!targetWord || !childsAttempt || !childName) {
    return "Something is missing. Let's try again.";
  }

  const prompt = `
    You are a friendly and encouraging speech coach for a young child named ${childName}. 
    The child is trying to say the word or phrase: "${targetWord}". They said "${childsAttempt}".
    
    Your task is to:
    1. Analyze the child's pronunciation of "${targetWord}".
    2. Provide a short, simple, and positive feedback in 1-2 friendly sentences to help them say it correctly.
    3. If they said it perfectly or very close, praise them enthusiastically!
    4. If they made a mistake, gently guide them. For example, if they said 'suden' for 'suddenly', you could say "That's a great try, ${childName}! Let's try it again. Remember the 'ly' sound at the end. Sud-den-ly."
    5. Keep your response under 30 words.
    6. Never use quotation marks in your response. Address the child by their name.
    7. If the child's attempt is gibberish or completely unrelated to the target, kindly ask them to try again to say "${targetWord}".
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.5,
            topP: 0.95,
        }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not get feedback from AI coach.");
  }
}
