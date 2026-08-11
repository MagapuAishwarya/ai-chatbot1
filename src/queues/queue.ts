import { boss } from "../lib/pgBoss.js";

// Creates  queues required by the application
// This function is called once when the server starts
export async function setupQueues() {

    // Creates a queue named "test-job"
    await boss.createQueue("test-job");
}









/*
--------------->queue.ts

Creates background job queues,Queues are where jobs wait before workers process them

*/