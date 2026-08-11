import "dotenv/config";
import { Langfuse } from "langfuse";

export const langfuse = new Langfuse({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
    secretKey: process.env.LANGFUSE_SECRET_KEY!,
    baseUrl: process.env.LANGFUSE_BASE_URL!,
});






/*
------------------>langfuse.ts

Creates the Langfuse client
Instead of creating a new Langfuse object everywhere

new Langfuse(...)

you create it once and reuse it throughout the application

 */