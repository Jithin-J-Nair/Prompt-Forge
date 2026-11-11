import { describe, expect, it } from "vitest";
import { buildMegaPrompt, buildQuickPrompt } from "../mega-compiler";
import { LEXICON } from "../index";
import { getModule } from "@/lib/studio";

describe("PromptForge prompt modes", () => {
  it("creates a concise quick prompt without inventing an audience", () => {
    const prompt = buildQuickPrompt({ brief: "A portfolio for a ceramic artist" });
    expect(prompt).toContain("A portfolio for a ceramic artist");
    expect(prompt).toContain("state assumptions instead of inventing facts");
    expect(prompt.split(/\s+/).length).toBeLessThan(180);
  });

  it("returns no quick prompt for an empty brief", () => {
    expect(buildQuickPrompt({ brief: "   " })).toBe("");
  });

  it("compiles typed modules and micro-directives into one mega prompt", () => {
    const moduleKeyword = LEXICON.find((keyword) => keyword.module);
    const microKeyword = LEXICON.find((keyword) => !keyword.module);
    expect(moduleKeyword).toBeDefined();
    expect(microKeyword).toBeDefined();

    const result = buildMegaPrompt({
      brief: "An immersive portfolio for a motion designer",
      projectName: "Field Notes",
      keywordIds: [moduleKeyword!.id, microKeyword!.id],
      target: "cursor",
      depth: "extreme",
    });

    expect(result.prompt).toContain("An immersive portfolio for a motion designer");
    expect(result.prompt).toContain(moduleKeyword!.name);
    expect(result.prompt).toContain(microKeyword!.name);
    expect(result.moduleCount).toBe(1);
    expect(result.microCount).toBe(1);
    expect(result.wordCount).toBeGreaterThan(100);
  });
  it("preserves tuned parameter values in the mega prompt", () => {
    const keyword = LEXICON.find((item) => item.module && getModule(item.module)?.params.length);
    expect(keyword?.module).toBeTruthy();
    const module = getModule(keyword!.module!);
    const param = module!.params[0];
    const value = param.type === "range" || param.type === "number"
      ? (param.min ?? 1)
      : param.type === "boolean"
        ? !Boolean(param.default)
        : param.type === "select"
          ? (param.options?.[0]?.value ?? String(param.default))
          : "custom-value";

    const result = buildMegaPrompt({
      brief: "A portfolio for a generative artist",
      keywordIds: [keyword!.id],
      paramsByKeywordId: { [keyword!.id]: { [param.key]: value } },
      target: "raw",
      depth: "extreme",
    });

    expect(result.prompt).toContain(`${param.label}: ${String(value)}`);
  });

  it("reports unknown keyword IDs instead of silently dropping them", () => {
    const result = buildMegaPrompt({
      brief: "A portfolio for an illustrator",
      keywordIds: ["not-a-real-keyword"],
      target: "raw",
      depth: "extreme",
    });

    expect(result.invalidCount).toBe(1);
    expect(result.prompt).toContain("unknown keyword ID");
    expect(result.warnings).toContain('Unknown keyword ID "not-a-real-keyword" was not compiled.');
  });

});
