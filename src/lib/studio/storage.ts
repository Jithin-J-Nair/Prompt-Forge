import "server-only";
import type { SelectionInput } from "./compiler";

/* ------------------------------------------------------------------ */
/*  Composition persistence. Tries Postgres (via lazy db) first; falls  */
/*  back to a per-process in-memory store so the studio works fully     */
/*  with no DATABASE_URL configured. Never imported by UI/pure libs.    */
/* ------------------------------------------------------------------ */

export interface CompositionRecord {
  id: string;
  name: string;
  brief: string;
  selections: SelectionInput[];
  compiled: string;
  moduleCount: number;
  createdAt: string;
  persisted: "database" | "memory";
}

export interface CompositionInput {
  name: string;
  brief: string;
  selections: SelectionInput[];
  compiled: string;
}

const mem = globalThis as typeof globalThis & {
  __promptForgeCompositions?: Map<string, CompositionRecord>;
};
function memStore(): Map<string, CompositionRecord> {
  mem.__promptForgeCompositions ??= new Map();
  return mem.__promptForgeCompositions;
}

function isDbReady(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export async function saveComposition(input: CompositionInput): Promise<CompositionRecord> {
  const entry = {
    name: input.name.slice(0, 160) || "Untitled composition",
    brief: input.brief ?? "",
    selections: input.selections ?? [],
    compiled: input.compiled,
    moduleCount: input.selections?.length ?? 0,
  };

  if (isDbReady()) {
    try {
      const { db } = await import("@/db");
      const { compositions } = await import("@/db/schema");
      const [row] = await db
        .insert(compositions)
        .values(entry)
        .returning();
      return {
        id: String(row.id),
        name: row.name,
        brief: row.brief,
        selections: row.selections as SelectionInput[],
        compiled: row.compiled,
        moduleCount: row.moduleCount,
        createdAt: row.createdAt.toISOString(),
        persisted: "database",
      };
    } catch {
      // fall through to memory — composition saving must not break the studio
    }
  }

  const id = `mem_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const rec: CompositionRecord = {
    id,
    ...entry,
    createdAt: new Date().toISOString(),
    persisted: "memory",
  };
  memStore().set(id, rec);
  // cap memory store to avoid unbounded growth in long-lived processes
  if (memStore().size > 200) {
    const oldest = memStore().keys().next().value;
    if (oldest) memStore().delete(oldest);
  }
  return rec;
}

export async function listCompositions(limit = 50): Promise<CompositionRecord[]> {
  if (isDbReady()) {
    try {
      const { db } = await import("@/db");
      const { compositions } = await import("@/db/schema");
      const { desc } = await import("drizzle-orm");
      const rows = await db
        .select()
        .from(compositions)
        .orderBy(desc(compositions.createdAt))
        .limit(Math.min(200, Math.max(1, limit)));
      return rows.map((row) => ({
        id: String(row.id),
        name: row.name,
        brief: row.brief,
        selections: row.selections as SelectionInput[],
        compiled: row.compiled,
        moduleCount: row.moduleCount,
        createdAt: row.createdAt.toISOString(),
        persisted: "database",
      }));
    } catch {
      // fall through
    }
  }
  return [...memStore().values()]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, limit);
}

export async function getComposition(id: string): Promise<CompositionRecord | null> {
  if (isDbReady() && /^\d+$/.test(id)) {
    try {
      const { db } = await import("@/db");
      const { compositions } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");
      const rows = await db.select().from(compositions).where(eq(compositions.id, Number(id)));
      if (rows.length) {
        const row = rows[0];
        return {
          id: String(row.id),
          name: row.name,
          brief: row.brief,
          selections: row.selections as SelectionInput[],
          compiled: row.compiled,
          moduleCount: row.moduleCount,
          createdAt: row.createdAt.toISOString(),
          persisted: "database",
        };
      }
    } catch {
      // fall through
    }
  }
  return memStore().get(id) ?? null;
}

export async function deleteComposition(id: string): Promise<boolean> {
  let ok = false;
  if (isDbReady() && /^\d+$/.test(id)) {
    try {
      const { db } = await import("@/db");
      const { compositions } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");
      await db.delete(compositions).where(eq(compositions.id, Number(id)));
      ok = true;
    } catch {
      // fall through
    }
  }
  if (memStore().delete(id)) ok = true;
  return ok;
}
