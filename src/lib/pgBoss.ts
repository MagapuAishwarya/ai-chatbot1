//imports the PgBoss class from the pg-boss package.
import { PgBoss } from "pg-boss";

//creating a pg-boss instance.
export const boss = new PgBoss({
    //Connecting this to  PostgreSQL database."
    connectionString: process.env.DATABASE_URL!,
});






/*
------------------>pgBoss.ts

Creates the pg-boss instance.
Just like the database connection, it's created once and reused.


*/