import { MeshyProvider } from '../../src/providers/meshy/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log("Starting integration test harness...");

  if (!process.env.MESHY_API_KEY) {
    console.error("Error: MESHY_API_KEY not found in environment variables.");
    process.exit(1);
  }

  const provider = new MeshyProvider();

  try {
    // 1. Check Balance
    console.log("\n1. Checking Balance...");
    const balanceStart = await provider.getBalance();
    console.log("Initial Balance:", balanceStart);

    // 2. Create Text-to-3D Job
    console.log("\n2. Creating Text-to-3D Job (Preview)...");
    const job = await provider.createJob('text-to-3d', {
      mode: 'preview',
      prompt: 'a simple wooden crate',
      art_style: 'realistic',
      ai_model: 'meshy-4' // Use meshy-4 for cheaper/faster test if possible, or latest
    });
    console.log("Job Created:", job.id);

    // 3. Poll for Completion
    console.log("\n3. Polling for Completion...");
    let currentJob = job;
    while (currentJob.status === 'pending' || currentJob.status === 'in-progress') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      currentJob = await provider.getJob(job.id, { type: 'text-to-3d' });
      process.stdout.write(`\rStatus: ${currentJob.status}, Progress: ${currentJob.progress}%`);
    }
    console.log("\nJob Finished with status:", currentJob.status);

    if (currentJob.status === 'failed') {
        console.error("Job Failed:", currentJob.error);
    } else {
        console.log("Job Output:", JSON.stringify(currentJob.outputs, null, 2));
    }

    // 4. Check Balance Again
    console.log("\n4. Checking Balance Delta...");
    const balanceEnd = await provider.getBalance();
    console.log("Final Balance:", balanceEnd);
    console.log("Cost:", balanceStart.balance - balanceEnd.balance);

    console.log("\nIntegration test complete.");

  } catch (error) {
    console.error("\nIntegration test failed:", error);
  }
}

main();
