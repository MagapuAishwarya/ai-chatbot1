// Loads environment variables from the .env file
import "dotenv/config";

// Drizzle ORM - used to interact with PostgreSQL
import { drizzle } from "drizzle-orm/node-postgres";

// PostgreSQL client
import { Pool } from "pg";

// Create a connection pool to PostgreSQL
// The database URL is read from the .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Drizzle database instance using the PostgreSQL pool
export const db = drizzle(pool);




/*
--------------->index.ts

Creates the PostgreSQL connection.Without it, no file can access the database.

*/