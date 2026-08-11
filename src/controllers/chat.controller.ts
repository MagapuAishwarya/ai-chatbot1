import type { FastifyRequest } from "fastify";
import { chatSchema } from "../schemas/chat.schema.js";
import { langfuse } from "../lib/langfuse.js";
import { processChat, saveAssistantMessage, } from "../services/chat.service.js";
import { generateResponse } from "../services/gemini.service.js";

interface ChatRequestBody {
    sessionId: string;
    message: string;
}

export async function chatController(
    request: FastifyRequest<{
        Body: ChatRequestBody;
    }>                                     //<   > A generic lets us give extra information about a type.
) {

    // Validate the incoming request
    const result = chatSchema.safeParse(request.body);

    if (!result.success) {
        return {
            error: "Invalid request data",
        };
    }

    // Extract the validated data
    const { sessionId, message } = result.data;
    // Create a Langfuse trace to monitor the complete request
    const trace = langfuse.trace({
        name: "chat-request",
        sessionId,
        userId: sessionId,
        metadata: {
            endpoint: "/chat",
            model: "gemini-3.6-flash",
            application: "AI Knowledge Assistant",
        },
    });
    // Prepare the final prompt using chat history and RAG
    const { prompt } = await processChat(
        sessionId,
        message
    );

    try {

        // Track the Gemini API call inside Langfuse
        const geminiSpan = trace.span({
            name: "gemini-call",
            input: prompt,
        });

        // Generate the AI response
        const response = await generateResponse(prompt);

        console.log(response);

        // Save the Gemini output in Langfuse
        geminiSpan.end({
            output: response.text,
        });

        // Save the assistant's response to the database
        await saveAssistantMessage(
            sessionId,
            response.text!
        );

        // Send all traces to the Langfuse server
        await langfuse.flushAsync();

        // Return the AI response
        return {
            response: response.text,
        };

    } catch (error) {

        console.error(error);

        return {
            error: "Something went wrong while talking to Gemini.",
        };
    }

}










/*
------------>chat.controller.ts

Controls the request
It:

--->receives the request
--->validates it
--->calls services
--->returns the response
*/