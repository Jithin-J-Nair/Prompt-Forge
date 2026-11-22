# Agent handoff boundary

The initial platform exports reviewed instructions and manifests to external agents; it does not execute them. Each handoff must pin package/artifact hashes, skill versions, dependencies, scope, acceptance evidence, and stop conditions. Never embed credentials or grant tool permissions through generated text. A future executor requires a separate threat model, authorization, capability scoping, approval gates, audit trail, and kill switch.

Contract validation artifacts:

- [`export-manifest.schema.json`](export-manifest.schema.json) — handoff manifest with `executionAuthorized: false`.
- [`fixtures/`](fixtures/) — blocked export fixture for the unfinished draft package.
