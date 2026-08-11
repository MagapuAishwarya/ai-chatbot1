import dotenv from "dotenv";
import { loadKnowledge } from "./services/knowledge.service.js";

// Load environment variables
dotenv.config();

// Generate embeddings and store them in PostgreSQL
await loadKnowledge();

console.log("Knowledge embeddings loaded successfully.");