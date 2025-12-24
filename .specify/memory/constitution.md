<!--
SYNC IMPACT REPORT
Version: 1.0.0 -> 1.1.0
Modified Principles:
- Added VI. Operational Integrity
Templates requiring updates:
- ✅ .specify/templates/plan-template.md (Generic references only)
- ✅ .specify/templates/spec-template.md (Generic references only)
- ✅ .specify/templates/tasks-template.md (Generic references only)
-->

# asset-mcp Constitution
<!-- Defines the core architectural and operational principles for the asset-mcp project -->

## Core Principles

### I. Extensibility-First
<!-- Architecture must support new asset types without core refactoring -->
The system is designed as a plugin-based architecture where new asset types (audio, image, Lottie) can be added as independent modules without modifying the core orchestration logic. Adding a new "type" should never require changes to the main dispatching mechanism.

### II. Provider Abstraction
<!-- Decouple business logic from specific external APIs -->
External services (e.g., Meshy, OpenAI, ElevenLabs) must be wrapped in adapters. The core system interacts with these adapters via a unified interface, ensuring provider swaps, API version updates, or fallback strategies do not leak into the business logic.

### III. Configuration-Driven
<!-- Runtime behavior controlled by config, not code -->
All external dependencies and behavior modifiers (API keys, model selection, default parameters, timeout settings) must be strictly configuration-driven. The system must support environment variables and runtime configuration overrides to ensure flexibility across different deployment contexts.

### IV. Type-Safe Contracts
<!-- Strict validation at system boundaries -->
Inputs (generation parameters, animation lists) and outputs (asset files, metadata) must be strictly typed and validated at the boundary (e.g., using Zod). Invalid requests must be rejected with clear errors before reaching any provider logic. Internal data flow must rely on guaranteed types.

### V. Standardized Artifacts
<!-- Consistent output format regardless of generation source -->
Every generation request, regardless of type or provider, must yield a consistent artifact structure: the asset file(s), a metadata manifest (provenance, parameters used), and a standardized success/error result object. Consumers should not need provider-specific logic to consume the output.

### VI. Operational Integrity
<!-- Environment and configuration hygiene -->

## Governance
<!-- Rules for maintaining and evolving this constitution -->

1.  **Supremacy**: This constitution supersedes all other project documentation and practices. In case of conflict, this document rules.
2.  **Amendments**: Changes to this document require a Pull Request with explicit justification, a Sync Impact Report, and a version bump.
3.  **Compliance**: All Code Reviews must verify alignment with these principles. Deviations must be corrected or the constitution amended.
4.  **Versioning**: The project follows Semantic Versioning (MAJOR.MINOR.PATCH).
    *   **MAJOR**: Breaking changes to principles or governance.
    *   **MINOR**: New principles or significant additions.
    *   **PATCH**: Clarifications or non-semantic fixes.

**Version**: 1.1.0 | **Ratified**: 2025-12-24 | **Last Amended**: 2025-12-24
