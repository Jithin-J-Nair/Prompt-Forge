import { STARTER_SKILLS } from "../catalog.ts";
import { CONTRACT_PATHS } from "./paths.ts";
import {
  assertPackageCompleteness,
  readJsonFixture,
  validateContract,
  type ContractName,
} from "./validate.ts";

interface Check {
  label: string;
  contract?: ContractName;
  value: unknown;
  extra?: () => string[];
}

const checks: Check[] = [
  ...STARTER_SKILLS.map((skill) => ({
    label: `skill:${skill.identity.slug}`,
    contract: "skill" as const,
    value: skill,
  })),
  {
    label: "fixture:project-dna",
    contract: "projectDna",
    value: readJsonFixture(CONTRACT_PATHS.fixtures.projectDna),
  },
  {
    label: "fixture:skill-graph",
    contract: "skillGraph",
    value: readJsonFixture(CONTRACT_PATHS.fixtures.skillGraph),
  },
  {
    label: "fixture:draft-package",
    contract: "packageManifest",
    value: readJsonFixture(CONTRACT_PATHS.fixtures.draftPackage),
    extra: () =>
      assertPackageCompleteness(
        readJsonFixture(CONTRACT_PATHS.fixtures.draftPackage) as {
          requiredArtifacts: string[];
          presentArtifacts: string[];
          missingArtifacts: string[];
        },
      ).errors,
  },
  {
    label: "fixture:not-started-review",
    contract: "reviewAssessment",
    value: readJsonFixture(CONTRACT_PATHS.fixtures.notStartedReview),
  },
  {
    label: "fixture:export-blocked",
    contract: "exportManifest",
    value: readJsonFixture(CONTRACT_PATHS.fixtures.exportBlocked),
  },
  {
    label: "negative:invalid-project-dna",
    contract: "projectDna",
    value: readJsonFixture(CONTRACT_PATHS.fixtures.invalidProjectDna),
  },
  {
    label: "negative:invalid-accepted-package",
    contract: "packageManifest",
    value: readJsonFixture(CONTRACT_PATHS.fixtures.invalidAcceptedPackage),
  },
];

let failures = 0;

for (const check of checks) {
  const result = check.contract
    ? validateContract(check.contract, check.value)
    : { valid: true, errors: [] as string[] };
  const extraErrors = check.extra?.() ?? [];
  const expectValid = !check.label.startsWith("negative:");
  const valid = result.valid && extraErrors.length === 0;

  if (valid !== expectValid) {
    failures += 1;
    const errors = [...result.errors, ...extraErrors];
    console.error(
      `FAIL ${check.label}${errors.length ? `: ${errors.join("; ")}` : ""}`,
    );
    continue;
  }

  console.log(`PASS ${check.label}`);
}

if (failures > 0) {
  console.error(`\n${failures} contract validation check(s) failed.`);
  process.exit(1);
}

console.log("\nAll contract validation checks passed.");
