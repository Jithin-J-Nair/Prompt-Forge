import assert from "node:assert/strict";
import test from "node:test";
import { analyzeBrief } from "./brief-intelligence.ts";

/**
 * Purpose / why extraction must return the full natural-language clause,
 * not a lone keyword verb from a mis-aimed capture group.
 */
const PURPOSE_BRIEFS = [
  {
    name: "ops inventory waste",
    categoryKey: "saas" as const,
    brief:
      "B2B ops workspace for warehouse leads to reduce inventory waste across cold-chain sites before spoil dates hit.",
    purpose: /reduce inventory waste across cold-chain sites/i,
  },
  {
    name: "clinic intake automation",
    categoryKey: "web-application" as const,
    brief:
      "Clinic front-desk tool for nurses to automate patient intake paperwork and stop retyping the same forms every morning.",
    purpose: /automate patient intake paperwork/i,
  },
  {
    name: "portfolio showcase",
    categoryKey: "awwwards-website" as const,
    brief:
      "Personal photography portfolio to showcase long-exposure coastal work with quiet typography and an intimate booking invite.",
    purpose: /showcase long-exposure coastal work/i,
  },
  {
    name: "commerce launch",
    categoryKey: "e-commerce" as const,
    brief:
      "Direct-to-consumer tea brand storefront to launch the spring harvest drop with tasting notes and subscription upsell.",
    purpose: /launch the spring harvest drop/i,
  },
  {
    name: "enterprise streamline",
    categoryKey: "enterprise-platform" as const,
    brief:
      "Internal compliance console for auditors to streamline quarterly evidence collection across regional tenants.",
    purpose: /streamline quarterly evidence collection/i,
  },
  {
    name: "in order to phrasing",
    categoryKey: "startup-mvp" as const,
    brief:
      "Founder CRM built in order to keep angel follow-ups honest without another spreadsheet graveyard.",
    purpose: /keep angel follow-ups honest/i,
  },
  {
    name: "so that phrasing",
    categoryKey: "saas" as const,
    brief:
      "Incident timeline so that on-call engineers can reconstruct who changed what before the page went red.",
    purpose: /on-call engineers can reconstruct who changed what/i,
  },
  {
    name: "so we can phrasing",
    categoryKey: "saas" as const,
    brief:
      "Hiring pipeline board so we can replace spreadsheet chaos with clear stage owners and SLA timers.",
    purpose: /replace spreadsheet chaos with clear stage owners/i,
  },
] as const;

test("why extraction returns full purpose clauses from diverse NL briefs", () => {
  for (const fixture of PURPOSE_BRIEFS) {
    const intel = analyzeBrief({
      categoryKey: fixture.categoryKey,
      brief: fixture.brief,
    });
    assert.equal(
      intel.why.status,
      "explicit",
      `${fixture.name}: expected explicit why, got inferred (${intel.why.text})`,
    );
    assert.match(
      intel.why.text,
      fixture.purpose,
      `${fixture.name}: purpose clause missing from why="${intel.why.text}"`,
    );
    // Capture-group regression: never ship a lone purpose verb as the why.
    assert.doesNotMatch(
      intel.why.text.trim(),
      /^(reduce|automate|improve|streamline|replace|showcase|launch|sell)$/i,
      `${fixture.name}: why collapsed to verb-only keyword stub`,
    );
    assert.ok(
      intel.why.text.trim().split(/\s+/).length >= 3,
      `${fixture.name}: why too short to be a purpose clause: "${intel.why.text}"`,
    );
  }
});

test("why stays inferred when brief has no purpose phrasing", () => {
  const intel = analyzeBrief({
    categoryKey: "saas",
    brief: "Simple ops dashboard for incident owners with audit trails.",
  });
  assert.equal(intel.why.status, "inferred");
  assert.ok(intel.why.text.length > 20);
});

test("audience and category mode still resolve on purpose-rich briefs", () => {
  const intel = analyzeBrief({
    categoryKey: "saas",
    brief:
      "B2B ops workspace for warehouse leads — built to reduce inventory waste across cold-chain sites.",
  });
  assert.equal(intel.categoryMode, "saas");
  assert.equal(intel.audience.status, "explicit");
  assert.match(intel.audience.text, /warehouse leads/i);
  assert.equal(intel.why.status, "explicit");
  assert.match(intel.summaryLine, /reduce inventory waste/i);
});
