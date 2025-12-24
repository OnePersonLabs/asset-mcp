# Implementation Plan: Meshy MCP Server

**Branch**: `001-meshy-mcp-server` | **Date**: 2025-12-24 | **Spec**: [specs/001-meshy-mcp-server/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-meshy-mcp-server/spec.md`

## Summary

Build a Model Context Protocol (MCP) server that wraps the Meshy API to provide 3D asset generation capabilities. The server will support text-to-3D, image-to-3D, remeshing, retexturing, rigging, and animation. It will normalize all operations into a unified `Job` model, track credit usage, and support both polling and SSE streaming for progress updates.

## Technical Context

**Language/Version**: TypeScript (Node.js 18+)
**Primary Dependencies**: 
- `@modelcontextprotocol/sdk`: For MCP server implementation
- `zod`: For schema validation
- `axios`: For HTTP requests (Meshy API)
- `eventsource`: For SSE client implementation
- `dotenv`: For environment variable management
**Testing**: `vitest` (Integration test harness runnable in VS Code)
**Target Platform**: Local execution (stdio)
**Project Type**: MCP Server (CLI)
**Architecture**: Provider Pattern (Meshy provider implementing a generic interface)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **No Breaking Changes**: New server, isolated functionality.
- [x] **Type Safety**: TypeScript used throughout.
- [x] **Testing**: Integration harness included.
- [x] **Documentation**: Spec and plan provided.

## Project Structure

### Documentation (this feature)

```text
specs/001-meshy-mcp-server/
├── plan.md              # This file
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```text
src/
├── index.ts                  # Entry point (MCP server setup)
├── config.ts                 # Configuration (Env vars)
├── types/
│   └── index.ts              # Shared types (Job, CreditBalance)
├── providers/
│   ├── base.ts               # Abstract base class / Interface for providers
│   └── meshy/
│       ├── index.ts          # MeshyProvider implementation
│       ├── client.ts         # Low-level Meshy API client (Axios + SSE)
│       └── types.ts          # Meshy-specific API types
└── tools/
    └── definitions.ts        # MCP Tool definitions

tests/
├── integration/
│   ├── harness.ts            # Integration test harness
│   └── meshy.test.ts         # Meshy provider integration tests
└── setup.ts                  # Test setup
```

**Structure Decision**: Single project structure with a `providers` directory to support the requested provider interface pattern, allowing future expansion to other asset generation services.

## Implementation Details

### 1. Data Models

**Normalized Job Model**:
```typescript
interface Job {
  id: string;
  provider: 'meshy';
  type: 'text-to-3d' | 'image-to-3d' | 'multi-image-to-3d' | 'remesh' | 'retexture' | 'rig' | 'animate';
  status: 'pending' | 'in-progress' | 'succeeded' | 'failed' | 'canceled';
  progress: number; // 0-100
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  credits: {
    before?: number;
    after?: number;
    delta?: number;
  };
  inputs: Record<string, any>; // Normalized inputs
  outputs: {
    models: {
      glb?: string;
      fbx?: string;
      obj?: string;
      usdz?: string;
      blend?: string;
      stl?: string;
    };
    textures: {
      base_color?: string;
      metallic?: string;
      roughness?: string;
      normal?: string;
    };
    thumbnail?: string;
  };
  error?: string;
}
```

### 2. Provider Interface

```typescript
interface IAssetProvider {
  name: string;
  getBalance(): Promise<number>;
  createJob(type: JobType, params: JobParams): Promise<Job>;
  getJob(jobId: string): Promise<Job>;
  cancelJob(jobId: string): Promise<void>; // If supported
  streamJob(jobId: string, onUpdate: (job: Job) => void): () => void; // Returns unsubscribe fn
}
```

### 3. Meshy Provider Implementation

- **Client**: Wrapper around `axios` for REST endpoints and `eventsource` for SSE (`/stream` endpoints).
- **Normalization**: Map Meshy's task-specific responses to the `Job` model.
- **Credit Tracking**: 
  - Fetch balance before `createJob`.
  - Fetch balance after job completion (or estimate based on task type if real-time update lags).
  - Store in `Job.credits`.

### 4. MCP Tools

- `meshy_create_text_to_3d`: Create text-to-3d job (preview/refine).
- `meshy_create_image_to_3d`: Create image-to-3d job.
- `meshy_create_multi_image_to_3d`: Create multi-image-to-3d job.
- `meshy_create_remesh`: Create remesh job.
- `meshy_create_retexture`: Create retexture job.
- `meshy_create_rigging`: Create rigging job.
- `meshy_create_animation`: Create animation job.
- `meshy_get_job`: Get job status (polling).
- `meshy_get_balance`: Get current credit balance.
- `meshy_list_jobs`: List recent jobs.

*Note: SSE streaming will be exposed via MCP's resource subscription or a long-running tool if supported, but primarily via `get_job` for standard tool usage. The spec mentions "support polling + SSE streaming", which implies the internal implementation should use SSE for efficiency or expose it if the client supports it.*

### 5. Integration Test Harness

- A standalone script or Vitest suite that:
  - Loads `MESHY_API_KEY` from `.env`.
  - Instantiates `MeshyProvider`.
  - Runs a full lifecycle test:
    1. Check balance.
    2. Create a cheap job (e.g., text-to-3d preview).
    3. Stream updates until completion.
    4. Verify output URLs.
    5. Check balance delta.
- Runnable via `npm test` or VS Code Test Explorer.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Provider Pattern | User explicitly requested "provider interface exists" for v1 | Direct implementation would be simpler but violates user constraint |
| SSE Support | User requested "polling + SSE streaming" | Polling only is simpler but less efficient and violates user constraint |
