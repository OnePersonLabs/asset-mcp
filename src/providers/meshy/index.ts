import { IAssetProvider } from '../base.js';
import { Job, CreditBalance } from '../../types/index.js';
import { MeshyClient } from './client.js';
import { MeshyTask } from './types.js';

export class MeshyProvider implements IAssetProvider {
  name = 'meshy';
  private client: MeshyClient;

  constructor() {
    this.client = new MeshyClient();
  }

  async getBalance(): Promise<CreditBalance> {
    const balance = await this.client.getBalance();
    return {
      balance,
      timestamp: Date.now()
    };
  }

  async createJob(type: Job['type'], params: Record<string, any>): Promise<Job> {
    const balanceBefore = await this.client.getBalance();
    let taskId: string;

    switch (type) {
      case 'text-to-3d':
        if (params.mode === 'refine') {
            taskId = await this.client.createTextTo3dRefine(params);
        } else {
            taskId = await this.client.createTextTo3dPreview(params);
        }
        break;
      case 'image-to-3d':
        taskId = await this.client.createImageTo3d(params);
        break;
      case 'multi-image-to-3d':
        taskId = await this.client.createMultiImageTo3d(params);
        break;
      case 'remesh':
        taskId = await this.client.createRemesh(params);
        break;
      case 'retexture':
        taskId = await this.client.createRetexture(params);
        break;
      case 'rig':
        taskId = await this.client.createRigging(params);
        break;
      case 'animate':
        taskId = await this.client.createAnimation(params);
        break;
      default:
        throw new Error(`Unsupported job type: ${type}`);
    }

    const task = await this.client.getTask(taskId, type);
    return this.normalizeTask(task, type, balanceBefore);
  }

  async getJob(jobId: string, options?: Record<string, any>): Promise<Job> {
    const type = options?.type;
    if (!type) {
        throw new Error("Job type is required to fetch job details (e.g. 'text-to-3d', 'image-to-3d')");
    }
    const task = await this.client.getTask(jobId, type);
    return this.normalizeTask(task, type);
  }

  streamJob(jobId: string, onUpdate: (job: Job) => void, options?: Record<string, any>): () => void {
    const type = options?.type;
    if (!type) {
        throw new Error("Job type is required to stream job details");
    }
    
    return this.client.streamTask(jobId, type, (task) => {
        onUpdate(this.normalizeTask(task, type));
    }, (err) => {
        console.error("Stream error:", err);
    });
  }

  private normalizeTask(task: MeshyTask, type: string, balanceBefore?: number): Job {
    let status: Job['status'] = 'pending';
    if (task.status === 'IN_PROGRESS') status = 'in-progress';
    else if (task.status === 'SUCCEEDED') status = 'succeeded';
    else if (task.status === 'FAILED') status = 'failed';
    else if (task.status === 'CANCELED') status = 'canceled';

    const outputs: Job['outputs'] = {
        models: {},
        textures: {},
        thumbnail: task.thumbnail_url
    };

    if (task.model_urls) {
        outputs.models = { ...task.model_urls };
    }
    
    if (task.texture_urls && task.texture_urls.length > 0) {
        outputs.textures = { ...task.texture_urls[0] };
    }

    if (task.result) {
        if (task.result.rigged_character_fbx_url) {
            outputs.rigging = {
                rigged_character_fbx_url: task.result.rigged_character_fbx_url,
                rigged_character_glb_url: task.result.rigged_character_glb_url
            };
        }
        if (task.result.animation_fbx_url) {
            outputs.animation = {
                animation_fbx_url: task.result.animation_fbx_url,
                animation_glb_url: task.result.animation_glb_url
            };
        }
    }

    return {
      id: task.id,
      provider: 'meshy',
      type: type as Job['type'],
      status,
      progress: task.progress,
      createdAt: task.created_at,
      startedAt: task.started_at,
      finishedAt: task.finished_at,
      credits: {
        before: balanceBefore,
      },
      inputs: {}, 
      outputs,
      error: task.task_error?.message
    };
  }
}
