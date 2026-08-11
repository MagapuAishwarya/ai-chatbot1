import { GoogleGenAI } from "@google/genai";

// Sends the prompt to Gemini and returns the AI response
export async function generateResponse(prompt: string) {

    // Create a Gemini client using the API key
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY!,
    });

    // Send the prompt to the Gemini model
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    });

    // Return Gemini's response
    return response;
}





/*
-------------->gemini.service.ts

Talks only to Gemini

*/