import { pgTable, serial, varchar, text, timestamp, } from "drizzle-orm/pg-core";

import { vector } from "drizzle-orm/pg-core";

// ---------------------- Messages Table ----------------------
export const messagesTable = pgTable("messages", {

  // Auto-increment primary key
  id: serial("id").primaryKey(),

  // Unique identifier for a chat session
  sessionId: varchar("session_id", {
    length: 100,
  }).notNull(),

  // Indicates who sent the message (user or assistant)
  role: varchar("role", {
    length: 100,
  }).notNull(),

  // Stores the actual chat message
  message: text("message").notNull(),

  // Automatically stores the time when the message is created
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

// -------------- Knowledge Table ----------------------
// Stores RAG knowledge and its vector embeddings
export const knowledgeTable = pgTable("knowledge", {

  // Auto-increment primary key
  id: serial("id").primaryKey(),

  fileName: text("file_name").notNull(),

  // Stores a chunk of text from the knowledge files
  chunk: text("chunk").notNull(),

  // Stores the vector embedding of the chunk
  embedding: vector("embedding", {
    dimensions: 3072,
  }).notNull(),
});







/*
------------->schema.ts

Defines the database tables,it as the database blueprint.
*/