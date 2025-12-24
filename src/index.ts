#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { config } from './config.js';
import { MeshyProvider } from './providers/meshy/index.js';
import * as Tools from './tools/definitions.js';

const provider = new MeshyProvider();

const server = new Server(
  {
    name: "meshy-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "meshy_create_text_to_3d",
        description: "Generate a 3D model from a text prompt",
        inputSchema: zodToJsonSchema(Tools.CreateTextTo3dSchema),
      },
      {
        name: "meshy_create_image_to_3d",
        description: "Generate a 3D model from an image",
        inputSchema: zodToJsonSchema(Tools.CreateImageTo3dSchema),
      },
      {
        name: "meshy_create_multi_image_to_3d",
        description: "Generate a 3D model from multiple images",
        inputSchema: zodToJsonSchema(Tools.CreateMultiImageTo3dSchema),
      },
      {
        name: "meshy_create_remesh",
        description: "Remesh an existing 3D model",
        inputSchema: zodToJsonSchema(Tools.CreateRemeshSchema),
      },
      {
        name: "meshy_create_retexture",
        description: "Retexture an existing 3D model",
        inputSchema: zodToJsonSchema(Tools.CreateRetextureSchema),
      },
      {
        name: "meshy_create_rigging",
        description: "Auto-rig a humanoid 3D model",
        inputSchema: zodToJsonSchema(Tools.CreateRiggingSchema),
      },
      {
        name: "meshy_create_animation",
        description: "Apply animation to a rigged model",
        inputSchema: zodToJsonSchema(Tools.CreateAnimationSchema),
      },
      {
        name: "meshy_get_job",
        description: "Get the status and details of a job",
        inputSchema: zodToJsonSchema(Tools.GetJobSchema),
      },
      {
        name: "meshy_get_balance",
        description: "Get current credit balance",
        inputSchema: zodToJsonSchema(Tools.GetBalanceSchema),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "meshy_create_text_to_3d": {
        const params = Tools.CreateTextTo3dSchema.parse(args);
        const job = await provider.createJob('text-to-3d', params);
        return { content: [{ type: "text", text: JSON.stringify(job, null, 2) }] };
      }
      case "meshy_create_image_to_3d": {
        const params = Tools.CreateImageTo3dSchema.parse(args);
        const job = await provider.createJob('image-to-3d', params);
        return { content: [{ type: "text", text: JSON.stringify(job, null, 2) }] };
      }
      case "meshy_create_multi_image_to_3d": {
        const params = Tools.CreateMultiImageTo3dSchema.parse(args);
        const job = await provider.createJob('multi-image-to-3d', params);
        return { content: [{ type: "text", text: JSON.stringify(job, null, 2) }] };
      }
      case "meshy_create_remesh": {
        const params = Tools.CreateRemeshSchema.parse(args);
        const job = await provider.createJob('remesh', params);
        return { content: [{ type: "text", text: JSON.stringify(job, null, 2) }] };
      }
      case "meshy_create_retexture": {
        const params = Tools.CreateRetextureSchema.parse(args);
        const job = await provider.createJob('retexture', params);
        return { content: [{ type: "text", text: JSON.stringify(job, null, 2) }] };
      }
      case "meshy_create_rigging": {
        const params = Tools.CreateRiggingSchema.parse(args);
        const job = await provider.createJob('rig', params);
        return { content: [{ type: "text", text: JSON.stringify(job, null, 2) }] };
      }
      case "meshy_create_animation": {
        const params = Tools.CreateAnimationSchema.parse(args);
        const job = await provider.createJob('animate', params);
        return { content: [{ type: "text", text: JSON.stringify(job, null, 2) }] };
      }
      case "meshy_get_job": {
        const params = Tools.GetJobSchema.parse(args);
        const job = await provider.getJob(params.job_id, { type: params.type });
        return { content: [{ type: "text", text: JSON.stringify(job, null, 2) }] };
      }
      case "meshy_get_balance": {
        const balance = await provider.getBalance();
        return { content: [{ type: "text", text: JSON.stringify(balance, null, 2) }] };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
    throw error;
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Meshy MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
