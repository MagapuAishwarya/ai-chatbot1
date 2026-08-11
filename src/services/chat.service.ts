import { eq, asc } from "drizzle-orm";
import { db } from "../db/index.js";
import { messagesTable } from "../db/schema.js";
import { searchKnowledge } from "./knowledge.service.js";

export async function processChat(
    sessionId: string,
    message: string
) {

    // Save the user's message in the database
    await db.insert(messagesTable).values({
        sessionId,
        role: "user",
        message,
    });

    // Retrieve the complete conversation history for this session
    const history = await db
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.sessionId, sessionId))
        .orderBy(asc(messagesTable.createdAt));

    // Convert the conversation history into a single text block
    const conversation = history
        .map((item) => `${item.role}: ${item.message}`)
        .join("\n");

    // Search the knowledge base using the user's message (RAG)
    const knowledge = await searchKnowledge(message);

    // Build the final prompt that will be sent to Gemini
    const prompt = `
You are a helpful company assistant.

Answer the user's question using ONLY the provided knowledge.

Instructions:
- Give clear and well-structured answers.
- Use headings when appropriate.
- Use bullet points for lists.
- If the answer contains steps, use numbered points.
- Highlight important terms using **bold**.
- Keep the answer concise and easy to understand.
- If the information is not available in the knowledge, say:
  "I couldn't find that information in the knowledge base."

Knowledge:
${knowledge}

Conversation:
${conversation}
`;
    // Return the prepared prompt
    return {
        prompt,
    };
}

// Save the assistant's response after Gemini generates it
export async function saveAssistantMessage(
    sessionId: string,
    message: string
) {
    await db.insert(messagesTable).values({
        sessionId,
        role: "assistant",
        message,
    });
}












/*
----------------->chat.service.ts

Contains the business logic

->Save messages
->Build prompts
->Read previous conversations
->Combine RAG results


*/