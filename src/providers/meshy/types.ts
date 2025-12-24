export interface MeshyTask {
  id: string;
  type: string; // 'text-to-3d-preview', 'text-to-3d-refine', 'image-to-3d', 'multi-image-to-3d', 'remesh', 'retexture', 'rig', 'animate'
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
  progress: number;
  created_at: number;
  started_at?: number;
  finished_at?: number;
  expires_at?: number;
  task_error?: {
    message: string;
  };
  model_urls?: {
    glb?: string;
    fbx?: string;
    obj?: string;
    usdz?: string;
    mtl?: string;
    blend?: string;
    stl?: string;
    pre_remeshed_glb?: string;
  };
  texture_urls?: Array<{
    base_color?: string;
    metallic?: string;
    roughness?: string;
    normal?: string;
  }>;
  thumbnail_url?: string;
  // Rigging specific
  result?: {
      rigged_character_fbx_url?: string;
      rigged_character_glb_url?: string;
      basic_animations?: {
          walking_glb_url?: string;
          walking_fbx_url?: string;
          running_glb_url?: string;
          running_fbx_url?: string;
      };
      // Animation specific
      animation_glb_url?: string;
      animation_fbx_url?: string;
      processed_usdz_url?: string;
      processed_armature_fbx_url?: string;
      processed_animation_fps_fbx_url?: string;
  };
}

export interface MeshyBalance {
    balance: number;
}
