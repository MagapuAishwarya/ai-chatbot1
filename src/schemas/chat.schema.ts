import { z } from "zod";
// Zod schema
export const chatSchema = z.object({
    sessionId: z.string(),
    message: z.string(),
});



/*
----------->chat.schema.ts


Defines what a valid request looks like


*/