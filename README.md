# Meshy MCP Server

An [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for [Meshy](https://meshy.ai/), enabling AI-powered 3D asset generation directly from your LLM environment.

## Features

This server exposes the full power of the Meshy API as MCP tools, allowing you to:

- **Text to 3D**: Generate 3D models from text descriptions.
- **Image to 3D**: Convert 2D images into 3D models.
- **Multi-Image to 3D**: Create higher quality models from multiple angles.
- **Remeshing**: Optimize existing 3D models (polycount reduction, format conversion).
- **Retexturing**: Apply new textures to existing models using AI.
- **Rigging**: Auto-rig humanoid characters.
- **Animation**: Apply animations to rigged characters.
- **Job Management**: Track progress and retrieve results.
- **Account Info**: Check your Meshy credit balance.

## Prerequisites

- **Node.js** (v18 or higher)
- **Meshy API Key**: You can obtain one from the [Meshy Dashboard](https://app.meshy.ai/settings/api).

## Installation

### 1. Clone and Build

```bash
git clone <repository-url>
cd meshy-mcp-server
npm install
npm run build
```

### 2. Configure Claude Desktop

Add the server to your Claude Desktop configuration file:

**Windows** (`%APPDATA%\Claude\claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "meshy": {
      "command": "node",
      "args": ["C:/path/to/meshy-mcp-server/dist/index.js"],
      "env": {
        "MESHY_API_KEY": "your_meshy_api_key_here"
      }
    }
  }
}
```

**macOS** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "meshy": {
      "command": "node",
      "args": ["/path/to/meshy-mcp-server/dist/index.js"],
      "env": {
        "MESHY_API_KEY": "your_meshy_api_key_here"
      }
    }
  }
}
```

*Note: Replace `/path/to/meshy-mcp-server` with the actual absolute path to the project directory.*

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

## License

ISC
