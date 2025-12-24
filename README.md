# Asset MCP - AI Agent Asset Generation Framework

A universal abstraction layer that empowers AI development tools to autonomously generate 2D, 3D, and audio assets through a unified interface, filling the gap in agentic workflows where no existing solution provides comprehensive asset generation capabilities.

## Overview

Asset MCP serves as the missing link in AI agent workflows, providing a standardized interface that enables AI development tools to autonomously create a wide range of asset types without human intervention. This abstraction layer bridges the gap between AI agents and various asset generation backends, from commercial APIs to self-hosted solutions.

## Purpose

This framework addresses a critical need in autonomous AI workflows:

- **Agentic Autonomy**: Enables AI tools to generate assets without human intervention
- **Comprehensive Asset Types**: Supports 2D images, 3D models, audio, and more through a single interface
- **Workflow Integration**: Seamlessly integrates into AI agent pipelines for end-to-end asset creation
- **Backend Flexibility**: Works with any asset generation backend, from paid APIs to self-hosted solutions

## Features

This server exposes powerful AI asset generation capabilities as MCP tools, allowing AI agents to:

- **Universal Asset Generation**: Generate 2D images, 3D models, and audio assets through a consistent interface
- **Multi-Backend Support**: Seamlessly switch between different AI asset generation backends
- **Text to 3D**: Generate 3D models from text descriptions
- **Image to 3D**: Convert 2D images into 3D models
- **Multi-Image to 3D**: Create higher quality models from multiple angles
- **Asset Processing**: Remeshing, retexturing, rigging, and animation capabilities
- **Job Management**: Track progress and retrieve results across different backends
- **Backend Abstraction**: Work with any asset generation API through standardized tools

## Supported Backends

- **Meshy**: Commercial 3D asset generation API
- **ComfyUI**: Self-hosted AI workflow system
- **Stable Diffusion**: Image generation capabilities
- **And more**: Easily extensible to support additional asset generation backends

## Prerequisites

- **Node.js** (v18 or higher)
- **Backend-specific credentials**: API keys or configuration for your chosen asset generation backends

## Installation

### 1. Clone and Build

```bash
git clone <repository-url>
cd asset-mcp
npm install
npm run build
```

### 2. Configure Claude Desktop

Add the server to your Claude Desktop configuration file:

**Windows** (`%APPDATA%\Claude\claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "asset-mcp": {
      "command": "node",
      "args": ["C:/path/to/asset-mcp/dist/index.js"],
      "env": {
        "MESHY_API_KEY": "your_meshy_api_key_here",
        "COMFYUI_ENDPOINT": "http://localhost:8188"
      }
    }
  }
}
```

**macOS** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "asset-mcp": {
      "command": "node",
      "args": ["/path/to/asset-mcp/dist/index.js"],
      "env": {
        "MESHY_API_KEY": "your_meshy_api_key_here",
        "COMFYUI_ENDPOINT": "http://localhost:8188"
      }
    }
  }
}
```

*Note: Replace `/path/to/asset-mcp` with the actual absolute path to the project directory.*

## Development

- **Build**: `npm run build`
- **Dev (Watch Mode)**: `npm run dev`
- **Test**: `npm test`
- **Lint**: `npm run lint`
- **Format**: `npm run format`

## Tools Reference

### Generation Tools

- **`create_text_to_3d`**
  - `prompt`: Description of the object.
  - `art_style`: 'realistic' or 'sculpture' (optional).
  - `mode`: 'preview' (fast) or 'refine' (high quality).
  - `ai_model`: 'meshy-4', 'meshy-5', or 'latest'.

- **`create_image_to_3d`**
  - `image_url`: URL of the input image.
  - `enable_pbr`: Enable PBR maps (optional).
  - `should_remesh`: Auto-remesh the result (optional).

- **`create_multi_image_to_3d`**
  - `image_urls`: List of 1-4 image URLs.

### Processing Tools

- **`create_remesh`**
  - `model_url` or `input_task_id`: Source model.
  - `target_polycount`: Desired polygon count.
  - `target_formats`: Output formats (glb, fbx, obj, etc.).

- **`create_retexture`**
  - `model_url` or `input_task_id`: Source model.
  - `text_style_prompt`: Description of new texture style.
  - `image_style_url`: Reference image for style (optional).

- **`create_rigging`**
  - `model_url` or `input_task_id`: Source humanoid model.

- **`create_animation`**
  - `rig_task_id`: ID of a completed rigging task.
  - `action_id`: Animation ID from Meshy library.

### Utility Tools

- **`get_job`**: Check the status and get results of any task.
- **`get_balance`**: Check your current Meshy credit balance.

## Extending to New Backends

The architecture is designed to be easily extensible. To add support for a new asset generation backend:

1. Create a new provider in the `src/providers/` directory
2. Implement the required interface methods
3. Register the provider in the main configuration
4. The new backend will automatically be available through the same unified tools

## License

ISC