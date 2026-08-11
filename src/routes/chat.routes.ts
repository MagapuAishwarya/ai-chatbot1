import type { FastifyInstance } from "fastify";
import { chatController } from "../controllers/chat.controller.js";

// Register all chat-related routes
export async function chatRoutes(app: FastifyInstance) {

    app.post(
        "/chat",
        {
            schema: {
                summary: "Chat with AI Assistant",
                description: "Send a message to the AI Knowledge Assistant.",

                body: {
                    type: "object",
                    required: ["sessionId", "message"],
                    properties: {
                        sessionId: {
                            type: "string",
                        },
                        message: {
                            type: "string",
                        },
                    },
                },

                response: {
                    200: {
                        type: "object",
                        properties: {
                            response: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        },
        chatController
    );
}






















/*  
------> chat.route.ts


Defines the API endpoints.
If /chat is called, execute chatController








*/