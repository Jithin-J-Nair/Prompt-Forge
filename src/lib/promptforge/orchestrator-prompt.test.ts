import assert from "node:assert/strict";
import test from "node:test";
import { composeProjectPreview } from "../skillforge/composer.ts";
import { buildCookPrompt } from "../skillforge/cook-prompt.ts";
import {
  buildOrchestratorPrompt,
  buildPromptForgeBridgePayload,
  isPromptForgeBridgePayload,
} from "./orchestrator-prompt.ts";

test("immersive BODY prompt links COOK skills and Awwwards bar", () => {
  const preview = composeProjectPreview({
    categoryKey: "awwwards-website",
    brief: "Awwwards site like activetheory.net",
  });
  const body = buildOrchestratorPrompt(preview);
  assert.match(body, /PROMPTFORGE BODY|BODY PROMPT|orchestrator/i);
  assert.match(body, /COOK\.md/);
  assert.match(body, /Phase 0/i);
  assert.match(body, /Awwwards|Active Theory/i);
  assert.match(body, /EXPERIENCE_DNA/);
  assert.match(body, /Browser critique loop/);
  assert.match(body, /Selected concept/);
  for (const node of preview.graph.nodes.slice(0, 3)) {
    assert.match(body, new RegExp(node.nodeKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.ok(body.length > 1500);
});

test("category BODY prompt stays non-immersive for AI product", () => {
  const preview = composeProjectPreview({
    categoryKey: "ai-product",
    brief: "Build an enterprise AI recruiting platform",
  });
  const body = buildOrchestratorPrompt(preview);
  assert.match(body, /COOK\.md/);
  assert.match(body, /category-best/i);
  assert.doesNotMatch(body, /Active Theory/);
});

test("bridge payload is typed and round-trips the guard", () => {
  const preview = composeProjectPreview({
    categoryKey: "ai-product",
    brief: "Build an enterprise AI recruiting platform",
  });
  const cook = buildCookPrompt(preview);
  const bridge = buildPromptForgeBridgePayload(preview, cook);
  assert.equal(bridge.version, 1);
  assert.equal(bridge.cookFilename, `skillforge-COOK-${preview.categoryKey}.md`);
  assert.equal(bridge.skillSlugs.length, preview.graph.nodes.length);
  assert.ok(bridge.orchestratorPrompt.length > 200);
  assert.ok(isPromptForgeBridgePayload(bridge));
  assert.equal(isPromptForgeBridgePayload({ version: 1 }), false);
});
