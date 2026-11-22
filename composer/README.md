# Skill composer boundary

The composer maps a pinned project revision and catalog/policy snapshot to an explainable skill graph. It owns requirement coverage, selection, priority, deduplication, conflict resolution, cycle checks, deterministic ordering, and provenance. Any unresolved hard conflict blocks generation. See the architecture's [composition procedure](../docs/SKILLFORGE_ARCHITECTURE.md#skill-graph-composition).

Contract validation artifacts:

- [`skill-graph.schema.json`](skill-graph.schema.json) — composed graph document schema.
- [`fixtures/`](fixtures/) — pinned deterministic graph cases for the AI Product pilot.
