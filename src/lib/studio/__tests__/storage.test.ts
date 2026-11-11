import { describe, expect, it } from "vitest";
import {
  deleteComposition,
  getComposition,
  listCompositions,
  saveComposition,
} from "@/lib/studio/storage";

/* The sandbox has no DATABASE_URL — this exercises the in-memory fallback
   contract that production/CI rely on when DB is unavailable. */

describe("composition storage (memory fallback)", () => {
  it("saves, lists, retrieves and deletes compositions without a database", async () => {
    const saved = await saveComposition({
      name: "Vitest Suite",
      brief: "b",
      selections: [{ id: "motion/marquee", params: { duration: 22 } }],
      compiled: "# compiled body",
    });
    expect(saved.persisted).toBe("memory");
    expect(saved.id).toBeTruthy();
    expect(saved.moduleCount).toBe(1);

    const list = await listCompositions();
    expect(list.some((c) => c.id === saved.id)).toBe(true);

    const got = await getComposition(saved.id);
    expect(got?.name).toBe("Vitest Suite");
    expect((got?.selections[0].params as Record<string, number>).duration).toBe(22);

    const gone = await deleteComposition(saved.id);
    expect(gone).toBe(true);
    expect(await getComposition(saved.id)).toBeNull();
  });

  it("caps name length and defaults empty names", async () => {
    const saved = await saveComposition({
      name: "x".repeat(400),
      brief: "",
      selections: [{ id: "websites/saas" }],
      compiled: "c",
    });
    expect(saved.name.length).toBe(160);
    const unnamed = await saveComposition({
      name: "   ".slice(0, 0) as string,
      brief: "",
      selections: [{ id: "websites/saas" }],
      compiled: "c",
    });
    expect(unnamed.name).toBe("Untitled composition");
    await deleteComposition(saved.id);
    await deleteComposition(unnamed.id);
  });
});
