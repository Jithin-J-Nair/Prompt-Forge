import { readFileSync } from "node:fs";
import Ajv2020, { type ErrorObject, type ValidateFunction } from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { CONTRACT_PATHS } from "./paths.ts";

export type ContractName =
  | "skill"
  | "projectDna"
  | "skillGraph"
  | "packageManifest"
  | "reviewAssessment"
  | "exportManifest";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const SCHEMA_FILES: Record<ContractName, string> = {
  skill: CONTRACT_PATHS.skillSchema,
  projectDna: CONTRACT_PATHS.projectDnaSchema,
  skillGraph: CONTRACT_PATHS.skillGraphSchema,
  packageManifest: CONTRACT_PATHS.packageManifestSchema,
  reviewAssessment: CONTRACT_PATHS.reviewAssessmentSchema,
  exportManifest: CONTRACT_PATHS.exportManifestSchema,
};

const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
  validateSchema: false,
});
addFormats(ajv);

const validators = new Map<ContractName, ValidateFunction>();

function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors?.length) return [];
  return errors.map((error) => {
    const path = error.instancePath || "/";
    return `${path} ${error.message ?? "failed validation"}`.trim();
  });
}

function getValidator(contract: ContractName): ValidateFunction {
  const cached = validators.get(contract);
  if (cached) return cached;

  const schema = JSON.parse(readFileSync(SCHEMA_FILES[contract], "utf8")) as object;
  const validator = ajv.compile(schema);
  validators.set(contract, validator);
  return validator;
}

export function validateContract(
  contract: ContractName,
  value: unknown,
): ValidationResult {
  const validator = getValidator(contract);
  const valid = validator(value);
  return {
    valid: Boolean(valid),
    errors: valid ? [] : formatErrors(validator.errors),
  };
}

export function readJsonFixture(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
}

export function assertPackageCompleteness(manifest: {
  requiredArtifacts: readonly string[];
  presentArtifacts: readonly string[];
  missingArtifacts: readonly string[];
}): ValidationResult {
  const errors: string[] = [];
  const required = new Set(manifest.requiredArtifacts);
  const present = new Set(manifest.presentArtifacts);
  const missing = new Set(manifest.missingArtifacts);

  for (const artifact of present) {
    if (!required.has(artifact)) {
      errors.push(`present artifact ${artifact} is not in requiredArtifacts`);
    }
    if (missing.has(artifact)) {
      errors.push(`artifact ${artifact} cannot be both present and missing`);
    }
  }

  for (const artifact of required) {
    const isPresent = present.has(artifact);
    const isMissing = missing.has(artifact);
    if (isPresent === isMissing) {
      errors.push(
        `artifact ${artifact} must be exactly one of present or missing`,
      );
    }
  }

  for (const artifact of missing) {
    if (!required.has(artifact)) {
      errors.push(`missing artifact ${artifact} is not in requiredArtifacts`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function assertDependencyOrder(graph: {
  nodes: readonly { nodeKey: string; assignedScope?: readonly string[] }[];
  edges: readonly { from: string; to: string; type: string }[];
}): ValidationResult {
  const order = new Map(graph.nodes.map((node, index) => [node.nodeKey, index]));
  const errors: string[] = [];

  for (const edge of graph.edges) {
    if (edge.type !== "depends_on") continue;
    const fromIndex = order.get(edge.from);
    const toIndex = order.get(edge.to);
    if (fromIndex === undefined) {
      errors.push(`edge source ${edge.from} is not a graph node`);
      continue;
    }
    if (toIndex === undefined) {
      errors.push(`edge target ${edge.to} is not a graph node`);
      continue;
    }
    if (fromIndex >= toIndex) {
      errors.push(
        `depends_on edge ${edge.from} → ${edge.to} violates topological order`,
      );
    }
  }

  const scopes = graph.nodes.flatMap((node) => node.assignedScope ?? []);
  if (scopes.length !== new Set(scopes).size) {
    errors.push("assigned scopes are not unique across nodes");
  }

  return { valid: errors.length === 0, errors };
}
