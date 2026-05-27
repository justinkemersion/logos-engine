import { describe, expect, it } from "vitest";
import { odyssey11Fixture } from "@/lib/agents/fixtures/odyssey-1-1";
import { loadAllCorpusEntries } from "./load-manifest";
import {
  parseGardenFrontmatter,
  renderPassageMarkdown,
} from "./render-passage-markdown";

describe("render-passage-markdown", () => {
  const entry = loadAllCorpusEntries().find((e) => e.work_slug === "odyssey")!;

  it("renders frontmatter and primary sections", () => {
    const markdown = renderPassageMarkdown(entry, odyssey11Fixture, {
      generatedAt: "2026-05-26",
      generatedByModel: "composer-2.5",
    });

    expect(markdown).toContain("author: Homer");
    expect(markdown).toContain("agent_profile: logos-passage-agent");
    expect(markdown).toContain("generated_by_model: composer-2.5");
    expect(markdown).toMatch(/source_hash: "?sha256:[a-f0-9]{64}"?/);
    expect(markdown).toContain("# Odyssey 1.1");
    expect(markdown).toContain("## Greek");
    expect(markdown).toContain("πολύτροπον");
    expect(markdown).toContain("## Literal");
    expect(markdown).toContain("Man to-me tell, Muse, many-turned.");
    expect(markdown).toContain("## Readable");
    expect(markdown).toContain("## Variants");
    expect(markdown).toContain("### πολύτροπον");
    expect(markdown).toContain("- many-turned");
    expect(markdown).toContain("## Tradeoffs");
    expect(markdown).toContain("### many-turned");
    expect(markdown).toContain("## Commentary");
    expect(markdown).toContain("## Editorial Warnings");
    expect(markdown).not.toContain("## Philosophical");
    expect(markdown).not.toContain("## Tokens");
  });

  it("parses frontmatter from rendered markdown", () => {
    const markdown = renderPassageMarkdown(entry, odyssey11Fixture, {
      generatedAt: "2026-05-26",
      generatedByModel: "composer-2.5",
    });
    const parsed = parseGardenFrontmatter(markdown);
    expect(parsed.sourceHash).toMatch(/^sha256:/);
    expect(parsed.generatedByModel).toBe("composer-2.5");
  });
});
