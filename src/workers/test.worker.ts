import { boss } from "../lib/pgBoss.js";

// Start all background workers
export async function startWorkers() {

    // Listen for jobs from the "test-job" queue
    await boss.work("test-job", async (jobs) => {

        // Get the first job from the batch
        const job = jobs[0];

        // Exit if there are no jobs to process
        if (!job) return;

        // Process the job (currently just printing the job data)
        console.log("Job received:", job.data);
    });
}




/*
-----------------------> test.worker.ts

Processes jobs from the queue.
*/