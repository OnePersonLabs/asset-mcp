import { Job, CreditBalance } from '../types/index.js';

export interface IAssetProvider {
  name: string;
  getBalance(): Promise<CreditBalance>;
  createJob(type: Job['type'], params: Record<string, any>): Promise<Job>;
  getJob(jobId: string, options?: Record<string, any>): Promise<Job>;
  streamJob(jobId: string, onUpdate: (job: Job) => void, options?: Record<string, any>): () => void;
}
