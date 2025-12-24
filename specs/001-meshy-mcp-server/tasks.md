---
description: "Task list for Meshy MCP Server implementation"
---

# Tasks: Meshy MCP Server

**Input**: Design documents from `/specs/001-meshy-mcp-server/`
**Prerequisites**: plan.md (required), spec.md (required)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure (src/, tests/, etc.)
- [ ] T002 Initialize TypeScript project with dependencies (@modelcontextprotocol/sdk, zod, axios, dotenv, eventsource)
- [ ] T003 [P] Configure linting (ESLint) and formatting (Prettier)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T004 Create shared types (Job, CreditBalance) in src/types/index.ts
- [ ] T005 Create provider interface (IAssetProvider) in src/providers/base.ts
- [ ] T006 Setup environment configuration in src/config.ts
- [ ] T007 Create basic MCP server shell in src/index.ts
- [ ] T008 Create Meshy API client skeleton in src/providers/meshy/client.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Text-to-3D (Priority: P1) 🎯 MVP

**Goal**: Generate 3D models from text prompts

**Independent Test**: Run integration harness to create a text-to-3d job and verify output

### Implementation for User Story 1

- [ ] T009 [US1] Implement Meshy API client methods for text-to-3d in src/providers/meshy/client.ts
- [ ] T010 [US1] Implement MeshyProvider.createJob (text-to-3d) in src/providers/meshy/index.ts
- [ ] T011 [US1] Implement MeshyProvider.getJob (polling) in src/providers/meshy/index.ts
- [ ] T012 [US1] Implement MeshyProvider.streamJob (SSE) in src/providers/meshy/index.ts
- [ ] T013 [US1] Define MCP tool `meshy_create_text_to_3d` in src/tools/definitions.ts
- [ ] T014 [US1] Define MCP tool `meshy_get_job` in src/tools/definitions.ts
- [ ] T015 [US1] Register tools in src/index.ts

**Checkpoint**: Text-to-3D flow functional

---

## Phase 4: User Story 2 - Image-to-3D (Priority: P1)

**Goal**: Generate 3D models from images

**Independent Test**: Run integration harness to create an image-to-3d job and verify output

### Implementation for User Story 2

- [ ] T016 [US2] Implement Meshy API client methods for image-to-3d in src/providers/meshy/client.ts
- [ ] T017 [US2] Update MeshyProvider.createJob for image-to-3d support
- [ ] T018 [US2] Define MCP tool `meshy_create_image_to_3d` in src/tools/definitions.ts
- [ ] T019 [US2] Define MCP tool `meshy_create_multi_image_to_3d` in src/tools/definitions.ts
- [ ] T020 [US2] Register new tools in src/index.ts

**Checkpoint**: Image-to-3D flow functional

---

## Phase 5: User Story 3 & 4 - Monitoring & Credits (Priority: P2)

**Goal**: Track credit usage and monitor progress

**Independent Test**: Verify balance delta in job result

### Implementation for User Story 3 & 4

- [ ] T021 [US4] Implement MeshyProvider.getBalance in src/providers/meshy/index.ts
- [ ] T022 [US4] Add credit tracking logic to createJob/getJob (before/after delta)
- [ ] T023 [US4] Define MCP tool `meshy_get_balance` in src/tools/definitions.ts
- [ ] T024 [US3] Verify SSE streaming robustness (reconnection, error handling) in src/providers/meshy/client.ts

**Checkpoint**: Credits tracked and monitoring robust

---

## Phase 6: Advanced Features (Priority: P3)

**Goal**: Remesh, Retexture, Rigging, Animation

**Independent Test**: Verify each advanced task type via harness

### Implementation for Advanced Features

- [ ] T025 [US5] Implement Remesh support in MeshyProvider and add `meshy_create_remesh` tool
- [ ] T026 [US6] Implement Retexture support in MeshyProvider and add `meshy_create_retexture` tool
- [ ] T027 [US7] Implement Rigging support in MeshyProvider and add `meshy_create_rigging` tool
- [ ] T028 [US7] Implement Animation support in MeshyProvider and add `meshy_create_animation` tool
- [ ] T029 [P] Register all advanced tools in src/index.ts

**Checkpoint**: All features implemented

---

## Phase 7: Testing & Polish

**Purpose**: Verification and cleanup

- [ ] T030 Create integration test harness in tests/integration/harness.ts
- [ ] T031 Run full integration suite against Meshy API (requires key)
- [ ] T032 Final code cleanup and documentation updates

