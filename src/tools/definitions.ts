import { z } from 'zod';

export const CreateTextTo3dSchema = z.object({
  prompt: z.string().describe("Describe what kind of object the 3D model is"),
  art_style: z.enum(['realistic', 'sculpture']).optional().describe("Desired art style"),
  mode: z.enum(['preview', 'refine']).default('preview').describe("Generation mode: 'preview' for base mesh, 'refine' for texturing"),
  preview_task_id: z.string().optional().describe("Required for 'refine' mode: The ID of the preview task"),
  ai_model: z.enum(['meshy-4', 'meshy-5', 'latest']).optional().default('latest'),
  topology: z.enum(['quad', 'triangle']).optional().default('triangle'),
  target_polycount: z.number().min(100).max(300000).optional().default(30000),
  should_remesh: z.boolean().optional().default(true),
  enable_pbr: z.boolean().optional().default(false),
});

export const CreateImageTo3dSchema = z.object({
  image_url: z.string().describe("URL or Data URI of the input image"),
  ai_model: z.enum(['meshy-4', 'meshy-5', 'latest']).optional().default('latest'),
  topology: z.enum(['quad', 'triangle']).optional().default('triangle'),
  target_polycount: z.number().min(100).max(300000).optional().default(30000),
  should_remesh: z.boolean().optional().default(true),
  should_texture: z.boolean().optional().default(true),
  enable_pbr: z.boolean().optional().default(false),
});

export const CreateMultiImageTo3dSchema = z.object({
  image_urls: z.array(z.string()).min(1).max(4).describe("List of 1-4 image URLs"),
  ai_model: z.enum(['meshy-5', 'latest']).optional().default('latest'),
  // ... similar optional params
});

export const CreateRemeshSchema = z.object({
  input_task_id: z.string().optional(),
  model_url: z.string().optional(),
  target_formats: z.array(z.enum(['glb', 'fbx', 'obj', 'usdz', 'blend', 'stl'])).optional().default(['glb']),
  topology: z.enum(['quad', 'triangle']).optional().default('triangle'),
  target_polycount: z.number().optional().default(30000),
});

export const CreateRetextureSchema = z.object({
  input_task_id: z.string().optional(),
  model_url: z.string().optional(),
  text_style_prompt: z.string().optional(),
  image_style_url: z.string().optional(),
  ai_model: z.enum(['meshy-4', 'meshy-5', 'latest']).optional().default('latest'),
});

export const CreateRiggingSchema = z.object({
  input_task_id: z.string().optional(),
  model_url: z.string().optional(),
  height_meters: z.number().optional().default(1.7),
});

export const CreateAnimationSchema = z.object({
  rig_task_id: z.string(),
  action_id: z.number().describe("Animation action ID from library"),
});

export const GetJobSchema = z.object({
  job_id: z.string(),
  type: z.string().describe("The type of job (text-to-3d, image-to-3d, etc.)"),
});

export const GetBalanceSchema = z.object({});
