# Feature Specification: Meshy MCP Server

**Feature Branch**: `001-meshy-mcp-server`  
**Created**: 2025-12-24  
**Status**: Draft  
**Input**: User description: "Build an MCP server that wraps Meshy for text-to-3d, image-to-3d, multi-image-to-3d, remesh, retexture, rigging, and animation; normalize everything into a Job model; include balance-before/after credit delta; support polling + SSE streaming; output GLB/FBX + textures + metadata."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate 3D Model from Text Description (Priority: P1)

A game developer wants to quickly generate 3D assets by describing what they need. They provide a text prompt like "a medieval knight's helmet" and receive a ready-to-use 3D model file with textures.

**Why this priority**: Text-to-3D is the most common entry point for 3D asset generation and provides immediate value without requiring input assets.

**Independent Test**: Can be fully tested by submitting a text prompt and verifying a downloadable 3D model with textures is returned. Delivers a complete 3D asset ready for use in games or applications.

**Acceptance Scenarios**:

1. **Given** a user with valid Meshy credentials and sufficient credits, **When** they submit a text prompt describing a 3D object, **Then** a job is created and the system tracks progress until a 3D model (GLB/FBX) with textures is available for download.
2. **Given** a text-to-3D job in progress, **When** the user requests status updates, **Then** they receive progress percentage and current job state (pending, in-progress, succeeded, failed).
3. **Given** a completed text-to-3D job, **When** the user requests the result, **Then** they receive model URLs (GLB, FBX), texture maps (base color, optionally PBR maps), thumbnail, and credit usage information.

---

### User Story 2 - Generate 3D Model from Image (Priority: P1)

A designer has a concept art image of a character and wants to convert it into a 3D model. They upload the image and receive a 3D model that matches the visual style of their concept.

**Why this priority**: Image-to-3D is equally important as text-to-3D, enabling users to convert existing 2D artwork into 3D assets.

**Independent Test**: Can be fully tested by submitting an image URL and verifying a 3D model matching the image is generated. Delivers a 3D asset based on visual reference.

**Acceptance Scenarios**:

1. **Given** a user provides an image URL or base64-encoded image, **When** they submit an image-to-3D request, **Then** a job is created that generates a 3D model resembling the input image.
2. **Given** multiple images of the same object from different angles, **When** the user submits a multi-image-to-3D request, **Then** a more accurate 3D model is generated using all provided perspectives.

---

### User Story 3 - Monitor Job Progress with Real-time Updates (Priority: P2)

A user has submitted a 3D generation job and wants to see real-time progress without repeatedly polling the server. They connect to a live stream and receive updates as the job progresses.

**Why this priority**: Real-time progress monitoring improves user experience significantly but is not required for basic functionality.

**Independent Test**: Can be tested by starting a job and connecting to the SSE stream, verifying progress events are received in real-time until completion.

**Acceptance Scenarios**:

1. **Given** a job has been submitted, **When** the user subscribes to SSE streaming for that job, **Then** they receive real-time progress updates including percentage and status changes.
2. **Given** a job is being monitored, **When** the job completes or fails, **Then** the final state is immediately pushed to the subscriber with complete result data.

---

### User Story 4 - Track Credit Balance and Usage (Priority: P2)

A team lead needs to monitor credit consumption across their projects. Before starting expensive operations, they check their balance and after completion, they see exactly how many credits were consumed.

**Why this priority**: Credit tracking is essential for budget management but jobs can still be submitted without it if users check balance separately.

**Independent Test**: Can be tested by querying balance before and after a job, verifying the balance delta matches expected credit cost.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they request their credit balance, **Then** they receive their current available credits.
2. **Given** a job has been completed, **When** the job result is returned, **Then** it includes the credit balance before the job and after, plus the calculated delta.

---

### User Story 5 - Remesh and Export Existing 3D Models (Priority: P3)

A 3D artist has a high-poly model and needs to reduce its polygon count while exporting to different formats. They submit the model for remeshing and receive optimized versions in their desired formats.

**Why this priority**: Remeshing is a post-processing feature that enhances existing assets rather than creating new ones.

**Independent Test**: Can be tested by submitting a model URL with target polycount and format options, verifying the output has reduced polygons and requested formats.

**Acceptance Scenarios**:

1. **Given** a user has an existing 3D model (URL or from a previous task), **When** they submit a remesh request with target polycount and format preferences, **Then** they receive the model in specified formats (GLB, FBX, OBJ, USDZ, blend, STL) with the requested polygon density.

---

### User Story 6 - Retexture an Existing 3D Model (Priority: P3)

A game developer wants to create variations of an existing 3D model with different textures. They provide the model and a text description or style image, receiving the same model with new textures applied.

**Why this priority**: Retexturing extends existing assets without generating new geometry, useful for creating variants.

**Independent Test**: Can be tested by submitting a model with a style prompt, verifying the returned model has new textures matching the description.

**Acceptance Scenarios**:

1. **Given** a user has a 3D model and a style description or reference image, **When** they submit a retexture request, **Then** they receive the same model with newly generated textures matching their style input.

---

### User Story 7 - Rig and Animate Humanoid Characters (Priority: P3)

A game developer has generated a humanoid character and needs it rigged and animated for their game. They submit the model for auto-rigging and select animations from the library.

**Why this priority**: Rigging and animation are advanced features for humanoid characters only, building on top of 3D generation.

**Independent Test**: Can be tested by submitting a humanoid model for rigging, then applying an animation from the library, verifying output includes rigged character with animation clips.

**Acceptance Scenarios**:

1. **Given** a user has a textured humanoid 3D model, **When** they submit a rigging request, **Then** they receive a rigged character in GLB/FBX format with basic walking and running animations.
2. **Given** a user has a rigged character, **When** they apply an animation from the action library, **Then** they receive the character with that animation applied in requested formats.

---

### Edge Cases

- What happens when the user has insufficient credits for a requested operation?
- How does the system handle invalid or corrupt image/model inputs?
- What happens when a job times out or Meshy API becomes unavailable?
- How are rate limits handled when the user exceeds Meshy's API quotas?
- What happens when requesting unsupported output formats for a given task type?
- How does the system handle jobs that fail mid-progress?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose MCP tools for all Meshy API operations: text-to-3d (preview + refine), image-to-3d, multi-image-to-3d, remesh, retexture, rigging, and animation.
- **FR-002**: System MUST normalize all Meshy task types into a unified Job model with consistent properties for id, type, status, progress, timestamps, inputs, outputs, and errors.
- **FR-003**: System MUST capture credit balance before starting a job and after completion, calculating and returning the credit delta with job results.
- **FR-004**: System MUST support polling-based job status retrieval via a "get job" tool that returns current job state.
- **FR-005**: System MUST support SSE streaming for real-time job progress updates as an alternative to polling.
- **FR-006**: System MUST return model URLs for supported output formats (GLB, FBX at minimum; OBJ, USDZ, MTL, blend, STL where applicable based on task type).
- **FR-007**: System MUST return texture URLs including base color and optionally PBR maps (metallic, roughness, normal) when enabled and available.
- **FR-008**: System MUST return job metadata including thumbnail URL, timestamps (created, started, finished, expires), preceding task count, and error details.
- **FR-009**: System MUST provide a tool to query current credit balance independently.
- **FR-010**: System MUST handle Meshy API errors gracefully and translate them into meaningful error messages for the MCP client.
- **FR-011**: System MUST support cancellation of pending or in-progress jobs where supported by Meshy API.
- **FR-012**: System MUST support deletion of completed jobs and their associated assets.
- **FR-013**: System MUST validate required parameters before submitting requests to Meshy API.
- **FR-014**: System MUST support listing jobs by type with pagination.

### Key Entities *(include if feature involves data)*

- **Job**: Unified representation of any Meshy task. Contains: id, type (text-to-3d-preview, text-to-3d-refine, image-to-3d, multi-image-to-3d, remesh, retexture, rig, animate), status (pending, in-progress, succeeded, failed, canceled), progress (0-100), timestamps, inputs (prompts, image URLs, configuration), outputs (model URLs, texture URLs, thumbnail), creditsBefore, creditsAfter, creditDelta, error.

- **ModelUrls**: Collection of downloadable URLs for different 3D formats. Contains: glb, fbx, obj, usdz, mtl, blend, stl, pre_remeshed_glb (all optional based on task type and configuration).

- **TextureUrls**: Collection of texture map URLs. Contains: base_color (always present), metallic, roughness, normal (present when PBR enabled).

- **CreditBalance**: Snapshot of user's credit state. Contains: balance (integer), timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can generate a usable 3D model from text in under 5 minutes for standard complexity objects.
- **SC-002**: Users can convert a 2D image to a 3D model in under 5 minutes.
- **SC-003**: All job types return results in a consistent, predictable format that can be processed uniformly.
- **SC-004**: Credit usage is accurately tracked with less than 1 credit variance between reported and actual consumption.
- **SC-005**: Real-time progress updates arrive within 2 seconds of status changes when using SSE streaming.
- **SC-006**: 95% of submitted jobs complete successfully with usable outputs when given valid inputs and sufficient credits.
- **SC-007**: Error messages clearly indicate the cause of failure (insufficient credits, invalid input, API error, timeout) enabling users to take corrective action.
- **SC-008**: Users can retrieve any generated asset (model, textures) within the Meshy retention period using returned URLs.

## Assumptions

- Users have valid Meshy API credentials and understand the credit-based pricing model.
- The MCP client environment supports both polling and SSE streaming protocols.
- Network connectivity to Meshy API (api.meshy.ai) is available and reliable.
- Input images and model URLs are publicly accessible when provided as URLs (not base64).
- Auto-rigging is limited to standard humanoid bipedal characters with clearly defined limbs.
- Generated assets follow Meshy's retention policy (limited time before expiry).
- Credit costs match Meshy's documented pricing: 20 credits for Meshy-6 preview, 5 credits for other models, 10 credits for texturing, etc.
