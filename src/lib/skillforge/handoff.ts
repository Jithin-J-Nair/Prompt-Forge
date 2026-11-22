import { createHash } from "node:crypto";
import { buildCookPrompt } from "./cook-prompt.ts";
import type { CompositionPreview } from "./types.ts";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export type AgentHandoffManifest = {
  schemaVersion: "1.0.0";
  handoffStatus: "prepared" | "blocked";
  packageAccepted: boolean;
  executionAuthorized: false;
  blockedReason?: string;
  packageChecksum: string;
  catalogVersion: string;
  graphHash: string;
  categoryKey: string;
  brief: string;
  artifacts: { logicalKey: string; mediaType: string; checksum: string }[];
  prohibitedOperations: string[];
  stopConditions: string[];
  agentInstructions: string[];
};

const PROHIBITED = [
  "Do not treat this package as authorization to run shell, deploy, or spend money.",
  "Do not access secrets, production credentials, or other tenants.",
  "Do not lower Review Council gates or erase unresolved findings.",
  "Do not invent confirmed Project DNA facts; label inferences and unknowns.",
];

export function buildAgentHandoffManifest(
  preview: CompositionPreview,
): AgentHandoffManifest {
  const artifacts = preview.artifactPreviews.map((artifact) => ({
    logicalKey: artifact.logicalKey,
    mediaType: "text/markdown",
    checksum: sha256(artifact.content),
  }));
  const packageChecksum = sha256(preview.exportMarkdown);
  const prepared = preview.accepted;

  return {
    schemaVersion: "1.0.0",
    handoffStatus: prepared ? "prepared" : "blocked",
    packageAccepted: preview.accepted,
    executionAuthorized: false,
    ...(prepared
      ? {}
      : {
          blockedReason:
            preview.council.gateReason ||
            "Review Council did not pass; keep package as draft guidance only.",
        }),
    packageChecksum,
    catalogVersion: preview.catalogVersion,
    graphHash: preview.graphHash,
    categoryKey: preview.categoryKey,
    brief: preview.brief,
    artifacts,
    prohibitedOperations: PROHIBITED,
    stopConditions: [
      "Stop if a blocking unknown requires a human decision.",
      "Stop if required artifacts or reviewers are missing.",
      "Stop before any production mutation or credential use.",
    ],
    agentInstructions: [
      "Read MASTER_SKILL_PACKAGE.md, PROJECT_DNA.md, and DESIGN_SYSTEM.md first.",
      "Follow skill graph priorities (P0 before P2) and only within assigned scopes.",
      "If immersive/Awwwards/Three.js skills are present: implement button/CTA micro-interactions, image/placeholder reveals, scroll theater, and GSAP/R3F per AGENT_EXECUTION_PACKAGE cook steps — do not invent a SaaS dashboard.",
      "Honor reduced-motion and performance budgets before claiming done.",
      "Preserve executionAuthorized=false until a separately authorized executor exists.",
      prepared
        ? "Council passed — use this pack as the instructional source of truth to cook the build."
        : "Council blocked — resolve findings before treating as accepted.",
    ],
  };
}

export function buildAgentHandoffMarkdown(
  preview: CompositionPreview,
  manifest: AgentHandoffManifest,
): string {
  const lines = [
    "# Agent Handoff Pack",
    "",
    `Status: **${manifest.handoffStatus}**`,
    `Accepted: **${manifest.packageAccepted}**`,
    `Execution authorized: **false**`,
    `Catalog: \`${manifest.catalogVersion}\``,
    `Graph: \`${manifest.graphHash}\``,
    "",
    "## Brief",
    preview.brief,
    "",
    "## Instructions for downstream agents",
    ...manifest.agentInstructions.map((line) => `- ${line}`),
    "- Prefer the companion **COOK.md** mega-prompt as the single paste target for coding agents.",
    "",
    "## Prohibited operations",
    ...manifest.prohibitedOperations.map((line) => `- ${line}`),
    "",
    "## Stop conditions",
    ...manifest.stopConditions.map((line) => `- ${line}`),
    "",
    "## Artifacts",
    ...manifest.artifacts.map(
      (artifact) => `- \`${artifact.logicalKey}\` · checksum \`${artifact.checksum.slice(0, 12)}…\``,
    ),
    "",
    "## Manifest (JSON)",
    "```json",
    JSON.stringify(manifest, null, 2),
    "```",
    "",
    "---",
    "",
    preview.exportMarkdown,
  ];
  return lines.join("\n");
}

export { buildCookPrompt };
