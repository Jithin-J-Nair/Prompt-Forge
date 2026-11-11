import "server-only";
import type { EnhancedSpec } from "./enhancer";

/* ------------------------------------------------------------------ */
/*  Spec record persistence for the Foundry.                             */
/*  Tries Postgres (lazy db) first; falls back to a per-process          */
/*  in-memory ledger so /forge, /library and /spec/[id] work fully       */
/*  without a DATABASE_URL. Records are labeled honestly.                */
/* ------------------------------------------------------------------ */

export interface SpecRecord {
  id: string; // DB rows: serial as string; memory: "spec_…"
  rawPrompt: string;
  title: string;
  industry: string;
  industryId: string;
  brandName: string;
  spec: EnhancedSpec;
  megaPrompt: string;
  wordCount: number;
  createdAt: Date;
  persisted: "database" | "memory";
}

const mem = globalThis as typeof globalThis & {
  __promptForgeSpecs?: Map<string, SpecRecord>;
};
function memStore(): Map<string, SpecRecord> {
  mem.__promptForgeSpecs ??= new Map();
  return mem.__promptForgeSpecs;
}

function dbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export async function saveSpec(spec: EnhancedSpec): Promise<SpecRecord> {
  const base = {
    rawPrompt: spec.rawPrompt,
    title: spec.title,
    industry: spec.industry,
    industryId: spec.industryId,
    brandName: spec.brand.name,
    spec,
    megaPrompt: spec.megaPrompt,
    wordCount: spec.stats.words,
  };

  if (dbConfigured()) {
    try {
      const { db } = await import("@/db");
      const { prompts } = await import("@/db/schema");
      const [row] = await db
        .insert(prompts)
        .values({ ...base, spec: base.spec as unknown as Record<string, unknown> })
        .returning();
      return { ...base, id: String(row.id), createdAt: row.createdAt, persisted: "database" };
    } catch (err) {
      console.error("spec db insert failed — falling back to memory", err);
    }
  }

  const id = `spec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const rec: SpecRecord = { ...base, id, createdAt: new Date(), persisted: "memory" };
  memStore().set(id, rec);
  if (memStore().size > 100) {
    const oldest = memStore().keys().next().value;
    if (oldest) memStore().delete(oldest);
  }
  return rec;
}

export async function listSpecs(limit = 24): Promise<SpecRecord[]> {
  const cap = Math.min(200, Math.max(1, limit));
  const out: SpecRecord[] = [];
  if (dbConfigured()) {
    try {
      const { db } = await import("@/db");
      const { prompts } = await import("@/db/schema");
      const { desc } = await import("drizzle-orm");
      const rows = await db.select().from(prompts).orderBy(desc(prompts.createdAt)).limit(cap);
      out.push(
        ...rows.map((r) => ({
          id: String(r.id),
          rawPrompt: r.rawPrompt,
          title: r.title,
          industry: r.industry,
          industryId: r.industryId,
          brandName: r.brandName,
          spec: r.spec as unknown as EnhancedSpec,
          megaPrompt: r.megaPrompt,
          wordCount: r.wordCount,
          createdAt: r.createdAt,
          persisted: "database" as const,
        })),
      );
    } catch (err) {
      console.error("spec db list failed — memory ledger only", err);
    }
  }
  out.push(...memStore().values());
  out.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return out.slice(0, cap);
}

export async function countDbSpecs(): Promise<number | null> {
  if (!dbConfigured()) return null;
  try {
    const { db } = await import("@/db");
    const { prompts } = await import("@/db/schema");
    const { sql } = await import("drizzle-orm");
    const [agg] = await db.select({ total: sql<number>`count(*)::int` }).from(prompts);
    return agg?.total ?? null;
  } catch {
    return null;
  }
}

export async function getSpec(id: string): Promise<SpecRecord | null> {
  const num = Number(id);
  if (dbConfigured() && Number.isInteger(num) && id.trim() !== "" && /^\d+$/.test(id)) {
    try {
      const { db } = await import("@/db");
      const { prompts } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");
      const [row] = await db.select().from(prompts).where(eq(prompts.id, num)).limit(1);
      if (row) {
        return {
          id: String(row.id),
          rawPrompt: row.rawPrompt,
          title: row.title,
          industry: row.industry,
          industryId: row.industryId,
          brandName: row.brandName,
          spec: row.spec as unknown as EnhancedSpec,
          megaPrompt: row.megaPrompt,
          wordCount: row.wordCount,
          createdAt: row.createdAt,
          persisted: "database",
        };
      }
    } catch (err) {
      console.error("spec db get failed — checking memory ledger", err);
    }
  }
  return memStore().get(id) ?? null;
}

export async function deleteSpec(id: string): Promise<boolean> {
  let ok = false;
  const num = Number(id);
  if (dbConfigured() && /^\d+$/.test(id)) {
    try {
      const { db } = await import("@/db");
      const { prompts } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");
      const [row] = await db.delete(prompts).where(eq(prompts.id, num)).returning({ id: prompts.id });
      if (row) ok = true;
    } catch (err) {
      console.error("spec db delete failed", err);
    }
  }
  if (memStore().delete(id)) ok = true;
  return ok;
}
