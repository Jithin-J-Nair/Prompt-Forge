import path from "node:path";
import { ingestSkillDirectory } from "./skill-ingest.ts";

const target = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve("skills/ingest/incoming");

const results = ingestSkillDirectory(target);
let failed = 0;
for (const result of results) {
  if (result.ok) {
    console.log(`OK  ${result.slug} ← ${result.file}`);
  } else {
    failed += 1;
    console.error(`FAIL ${result.file}`);
    for (const error of result.errors) console.error(`  - ${error}`);
  }
}

if (results.length === 0) {
  console.log(`No .json skills in ${target}`);
  console.log("Add curated SkillForge JSON skills, then re-run.");
}

process.exit(failed > 0 ? 1 : 0);
