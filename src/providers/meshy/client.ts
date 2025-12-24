import axios, { AxiosInstance } from 'axios';
import EventSource from 'eventsource';
import { config } from '../../config.js';
import { MeshyTask, MeshyBalance } from './types.js';

export class MeshyClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = config.MESHY_API_KEY;
    this.client = axios.create({
      baseURL: 'https://api.meshy.ai',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getBalance(): Promise<number> {
    const response = await this.client.get<MeshyBalance>('/openapi/v1/balance');
    return response.data.balance;
  }

  async createTextTo3dPreview(params: any): Promise<string> {
    const response = await this.client.post<{ result: string }>('/openapi/v2/text-to-3d', {
      mode: 'preview',
      ...params
    });
    return response.data.result;
  }

  async createTextTo3dRefine(params: any): Promise<string> {
    const response = await this.client.post<{ result: string }>('/openapi/v2/text-to-3d', {
      mode: 'refine',
      ...params
    });
    return response.data.result;
  }

  async createImageTo3d(params: any): Promise<string> {
    const response = await this.client.post<{ result: string }>('/openapi/v1/image-to-3d', params);
    return response.data.result;
  }

  async createMultiImageTo3d(params: any): Promise<string> {
    const response = await this.client.post<{ result: string }>('/openapi/v1/multi-image-to-3d', params);
    return response.data.result;
  }

  async createRemesh(params: any): Promise<string> {
    const response = await this.client.post<{ result: string }>('/openapi/v1/remesh', params);
    return response.data.result;
  }

  async createRetexture(params: any): Promise<string> {
    const response = await this.client.post<{ result: string }>('/openapi/v1/retexture', params);
    return response.data.result;
  }

  async createRigging(params: any): Promise<string> {
    const response = await this.client.post<{ result: string }>('/openapi/v1/rigging', params);
    return response.data.result;
  }

  async createAnimation(params: any): Promise<string> {
    const response = await this.client.post<{ result: string }>('/openapi/v1/animations', params);
    return response.data.result;
  }

  async getTask(taskId: string, type: string): Promise<MeshyTask> {
    let endpoint = '';
    if (type.startsWith('text-to-3d')) endpoint = `/openapi/v2/text-to-3d/${taskId}`;
    else if (type === 'image-to-3d') endpoint = `/openapi/v1/image-to-3d/${taskId}`;
    else if (type === 'multi-image-to-3d') endpoint = `/openapi/v1/multi-image-to-3d/${taskId}`;
    else if (type === 'remesh') endpoint = `/openapi/v1/remesh/${taskId}`;
    else if (type === 'retexture') endpoint = `/openapi/v1/retexture/${taskId}`;
    else if (type === 'rig') endpoint = `/openapi/v1/rigging/${taskId}`;
    else if (type === 'animate') endpoint = `/openapi/v1/animations/${taskId}`;
    else throw new Error(`Unknown task type: ${type}`);

    const response = await this.client.get<MeshyTask>(endpoint);
    return response.data;
  }

  streamTask(taskId: string, type: string, onUpdate: (task: MeshyTask) => void, onError: (err: any) => void): () => void {
    let endpoint = '';
    if (type.startsWith('text-to-3d')) endpoint = `/openapi/v2/text-to-3d/${taskId}/stream`;
    else if (type === 'image-to-3d') endpoint = `/openapi/v1/image-to-3d/${taskId}/stream`;
    else if (type === 'multi-image-to-3d') endpoint = `/openapi/v1/multi-image-to-3d/${taskId}/stream`;
    else if (type === 'remesh') endpoint = `/openapi/v1/remesh/${taskId}/stream`;
    else if (type === 'retexture') endpoint = `/openapi/v1/retexture/${taskId}/stream`;
    else if (type === 'rig') endpoint = `/openapi/v1/rigging/${taskId}/stream`;
    else if (type === 'animate') endpoint = `/openapi/v1/animations/${taskId}/stream`;
    else {
        onError(new Error(`Unknown task type: ${type}`));
        return () => {};
    }

    const url = `https://api.meshy.ai${endpoint}`;
    const es = new EventSource(url, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onUpdate(data);
        if (data.status === 'SUCCEEDED' || data.status === 'FAILED' || data.status === 'CANCELED') {
          es.close();
        }
      } catch (e) {
        onError(e);
      }
    };

    es.onerror = (err) => {
      onError(err);
      es.close();
    };

    return () => es.close();
  }
}
