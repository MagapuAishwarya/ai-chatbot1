import Fastify from "fastify";
import { chatRoutes } from "./routes/chat.routes.js";
import dotenv from "dotenv";
import { boss } from "./lib/pgBoss.js";
import { startWorkers } from "./workers/test.worker.js";
import { setupQueues } from "./queues/queue.js";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import multipart from "@fastify/multipart";

// Load environment variables from the .env file
dotenv.config();

// Create the Fastify application
const app = Fastify();


// Home route
app.get("/", async () => {
  return {
    message: "Welcome to AI Knowledge Assistant",
  };
});


// Start the pg-boss background job system
await boss.start();

// Create the required queues
await setupQueues();

// Start workers to process background jobs
await startWorkers();

// Send a normal priority job
await boss.send(
  "test-job",
  {
    message: "Normal Job",
  },
  {
    priority: 1,
  }
);

// Send a high priority job
await boss.send(
  "test-job",
  {
    message: "High Priority Job",
  },
  {
    priority: 10,
  }
);

// Example of scheduling a delayed job
/*
await boss.send(
  "test-job",
  {
    message: "Hello after 10 seconds!",
  },
  {
    startAfter: 10,
  }
);
*/

//// Register Swagger
await app.register(swagger, {
  openapi: {
    info: {
      title: "AI Knowledge Assistant API",
      description: "API documentation for the AI Knowledge Assistant",
      version: "1.0.0",
    },
  },
});

// Register Swagger UI
await app.register(swaggerUI, {
  routePrefix: "/docs",
});

// Register multipart first
await app.register(multipart);

// Register routes
await app.register(chatRoutes);

// Start the Fastify server
app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server running at ${address}`);
});







/*
-------------------- index.ts --------------------

This is the entry point of the application.

Responsibilities:

-> Loads environment variables
-> Creates the Fastify server
-> Starts pg-boss
-> Creates queues
-> Starts workers
-> Registers Swagger
-> Registers routes
-> Starts the server

Note:
Knowledge embeddings are NOT generated here anymore.
They are generated separately using:

npm run embed
*/