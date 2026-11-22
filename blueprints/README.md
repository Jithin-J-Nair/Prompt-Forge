# Blueprint contracts

Accepted packages contain the canonical artifacts and versioned manifest defined in [`../docs/SKILLFORGE_ARCHITECTURE.md`](../docs/SKILLFORGE_ARCHITECTURE.md#project-dna-and-artifact-package). Each artifact revision records a stable logical key, schema/template version, checksum, lineage, validation results, and review status. This design phase defines contracts only; it does not include generated project blueprints.

Contract validation artifacts:

- [`package-manifest.schema.json`](package-manifest.schema.json) — draft/accepted completeness rules.
- [`fixtures/`](fixtures/) — incomplete draft and invalid accepted-incomplete cases.
