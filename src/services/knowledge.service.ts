// Used to read files from the knowledge folder
import fs from "fs/promises";

// Used to create file paths that work on any operating system
import path from "path";

import { GoogleGenAI } from "@google/genai";
import { db } from "../db/index.js";
import { knowledgeTable } from "../db/schema.js";
import { cosineDistance } from "drizzle-orm";
import { eq } from "drizzle-orm";

// Create a Gemini client for embeddings
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// Load all knowledge files and store their embeddings in PostgreSQL
export async function loadKnowledge() {

  // Get the path of the knowledge folder
  const knowledgePath = path.join(process.cwd(), "knowledge");

  // Read all files inside the knowledge folder
  const files = await fs.readdir(knowledgePath);

  // Process each knowledge file
  for (const file of files) {

    // Check if this file is already embedded
    const existingFile = await db
      .select()
      .from(knowledgeTable)
      .where(eq(knowledgeTable.fileName, file))
      .limit(1);

    if (existingFile.length > 0) {
      console.log(`${file} already embedded. Skipping...`);
      continue;
    }

    // Build the complete path of the current file
    const filePath = path.join(knowledgePath, file);

    // Read the file content
    const content = await fs.readFile(filePath, "utf-8");

    // Split the document into smaller chunks
    const chunks = content.split("\n\n");

    console.log("==========");
    console.log(file);

    // Process each chunk separately
    for (const chunk of chunks) {

      // Generate a vector embedding for the chunk
      const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunk,
      });

      const embedding = response.embeddings?.[0]?.values;

      // Skip if no embedding was generated
      if (!embedding) {
        continue;
      }

      console.log("Embedding length:", embedding.length);

      // Store the chunk and its embedding in PostgreSQL
      await db.insert(knowledgeTable).values({
        fileName: file,
        chunk,
        embedding,
      });
    }
  }
}

// Search the knowledge base using semantic similarity
export async function searchKnowledge(question: string) {

  // Convert the user's question into an embedding
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: question,
  });

  const embedding = response.embeddings?.[0]?.values;

  // Return if embedding generation failed
  if (!embedding) {
    return null;
  }

  // Find the most similar knowledge chunk using cosine distance
  const result = await db
    .select()
    .from(knowledgeTable)
    .orderBy(
      cosineDistance(
        knowledgeTable.embedding,
        embedding
      )
    )
    .limit(3);
  // Return if no matching knowledge is found
  if (result.length === 0) {
    return null;
  }

  // Combine all retrieved chunks into one string
  const knowledge = result
    .map((item) => item.chunk)
    .join("\n\n");

  // Return the combined knowledge
  return knowledge;
}










/*
----------------->knowledge.service.ts

Manages the knowledge base

Reads .txt files
Splits them into chunks
Creates embeddings
Stores embeddings
Searches the vector database



*/