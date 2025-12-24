export interface Job {
  id: string;
  provider: 'meshy';
  type: 'text-to-3d' | 'image-to-3d' | 'multi-image-to-3d' | 'remesh' | 'retexture' | 'rig' | 'animate';
  status: 'pending' | 'in-progress' | 'succeeded' | 'failed' | 'canceled';
  progress: number;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  credits: {
    before?: number;
    after?: number;
    delta?: number;
  };
  inputs: Record<string, any>;
  outputs: {
    models: {
      glb?: string;
      fbx?: string;
      obj?: string;
      usdz?: string;
      blend?: string;
      stl?: string;
      pre_remeshed_glb?: string;
    };
    textures: {
      base_color?: string;
      metallic?: string;
      roughness?: string;
      normal?: string;
    };
    thumbnail?: string;
    rigging?: {
        rigged_character_fbx_url?: string;
        rigged_character_glb_url?: string;
    };
    animation?: {
        animation_glb_url?: string;
        animation_fbx_url?: string;
    };
  };
  error?: string;
}

export interface CreditBalance {
  balance: number;
  timestamp: number;
}
