import { describe, expect, it } from "vitest";
import { decodeStack, encodeStack } from "../compile";
import { LEXICON } from "../index";

describe("stable lexicon share links", () => {
  it("encodes stable keyword IDs rather than registry positions", () => {
    const ids = [LEXICON[0].id, LEXICON[LEXICON.length - 1].id];
    const encoded = encodeStack(ids);
    expect(encoded.startsWith("v2.")).toBe(true);
    expect(decodeStack(encoded)).toEqual(ids);
  });

  it("deduplicates selections and ignores unknown IDs", () => {
    const id = LEXICON[0].id;
    expect(decodeStack(encodeStack([id, id, "unknown"]))).toEqual([id]);
  });

  it("continues to decode legacy index-compressed links", () => {
    expect(decodeStack("0")).toEqual([LEXICON[0].id]);
  });
});
