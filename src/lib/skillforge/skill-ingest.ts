import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { deepenSkill } from "./skill-depth.ts";
import { buildSkill, type SkillSeed } from "./skill-factory.ts";
import type { SkillPackage } from "./types.ts";

export type IngestResult = {
  file: string;
  ok: boolean;
  slug?: string;
  errors: string[];
};

/**
 * Curated skill ingest: accepts SkillForge JSON skill documents (or SkillSeed JSON).
 * Does NOT fetch or paste third-party GitHub repos. Humans distill; this validates.
 */
export function parseSkillDocument(raw: string, file: string): { skill?: SkillPackage; errors: string[] } {
  const errors: string[] = [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { errors: [`${file}: invalid JSON`] };
  }
  if (!parsed || typeof parsed !== "object") {
    return { errors: [`${file}: root must be an object`] };
  }
  const doc = parsed as Record<string, unknown>;

  // Full SkillPackage shape
  if (doc.schemaVersion === "1.0.0" && doc.identity && typeof doc.identity === "object") {
    const skill = deepenSkill(doc as unknown as SkillPackage);
    const localErrors = validateSkillShape(skill, file);
    return localErrors.length ? { errors: localErrors } : { skill, errors: [] };
  }

  // SkillSeed shape
  if (typeof doc.slug === "string" && typeof doc.name === "string" && typeof doc.role === "string") {
    try {
      const skill = deepenSkill(buildSkill(doc as unknown as SkillSeed));
      const localErrors = validateSkillShape(skill, file);
      return localErrors.length ? { errors: localErrors } : { skill, errors: [] };
    } catch (error) {
      return { errors: [`${file}: ${error instanceof Error ? error.message : "seed build failed"}`] };
    }
  }

  errors.push(
    `${file}: expected SkillForge SkillPackage (schemaVersion 1.0.0) or SkillSeed JSON — not arbitrary GitHub skill markdown.`,
  );
  return { errors };
}

function validateSkillShape(skill: SkillPackage, file: string): string[] {
  const errors: string[] = [];
  if (!skill.identity?.slug) errors.push(`${file}: missing identity.slug`);
  if (!skill.mission || skill.mission.length < 40) errors.push(`${file}: mission too thin`);
  if (!skill.principles || skill.principles.length < 3) errors.push(`${file}: need ≥3 principles`);
  if (!skill.decisionFrameworks?.length) errors.push(`${file}: need decisionFrameworks`);
  if (!skill.antiPatterns?.length) errors.push(`${file}: need antiPatterns`);
  if (!skill.acceptanceCriteria?.length) errors.push(`${file}: need acceptanceCriteria`);
  if (!skill.examples?.length) errors.push(`${file}: need examples`);
  if (skill.principles?.includes("Separate confirmed facts from inferences.") && skill.principles.length <= 3) {
    errors.push(`${file}: still generic boilerplate — deepen before ingest`);
  }
  return errors;
}

export function ingestSkillDirectory(dirPath: string): IngestResult[] {
  const abs = path.resolve(dirPath);
  let entries: string[] = [];
  try {
    entries = readdirSync(abs)
      .filter((name) => name.endsWith(".json"))
      .map((name) => path.join(abs, name));
  } catch (error) {
    return [
      {
        file: abs,
        ok: false,
        errors: [error instanceof Error ? error.message : "Cannot read ingest directory"],
      },
    ];
  }

  return entries.map((file) => {
    if (!statSync(file).isFile()) {
      return { file, ok: false, errors: ["not a file"] };
    }
    const raw = readFileSync(file, "utf8");
    const parsed = parseSkillDocument(raw, file);
    if (!parsed.skill) {
      return { file, ok: false, errors: parsed.errors };
    }
    return { file, ok: true, slug: parsed.skill.identity.slug, errors: [] };
  });
}
