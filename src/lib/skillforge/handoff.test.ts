import assert from "node:assert/strict";
import test from "node:test";
import { composeProjectPreview } from "./composer.ts";
import { buildAgentHandoffManifest, buildAgentHandoffMarkdown } from "./handoff.ts";

test("accepted composition yields prepared handoff with executionAuthorized false", () => {
  const preview = composeProjectPreview({
    categoryKey: "ai-product",
    brief: "Build an enterprise AI recruiting platform",
  });
  const manifest = buildAgentHandoffManifest(preview);
  assert.equal(manifest.executionAuthorized, false);
  assert.equal(manifest.packageAccepted, preview.accepted);
  if (preview.accepted) {
    assert.equal(manifest.handoffStatus, "prepared");
  } else {
    assert.equal(manifest.handoffStatus, "blocked");
    assert.ok(manifest.blockedReason);
  }
  assert.equal(manifest.artifacts.length, preview.artifactPreviews.length);
  assert.match(manifest.packageChecksum, /^[a-f0-9]{64}$/);
  const markdown = buildAgentHandoffMarkdown(preview, manifest);
  assert.match(markdown, /Agent Handoff Pack/);
  assert.match(markdown, /Execution authorized: \*\*false\*\*/);
  assert.match(markdown, /COOK\.md/);
  assert.match(markdown, /PromptForge BODY/i);
});
