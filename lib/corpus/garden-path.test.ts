import { describe, expect, it } from "vitest";
import {
  corpusAgentDraftPath,
  corpusGardenMarkdownPath,
  formatSequenceFilename,
  legacyAgentDraftPath,
} from "./garden-path";
import { loadAllCorpusEntries } from "./load-manifest";

describe("garden-path", () => {
  const manifest = loadAllCorpusEntries();
  const odyssey = manifest.find((e) => e.work_slug === "odyssey")!;

  it("formats sequence filenames", () => {
    expect(formatSequenceFilename(1)).toBe("001.md");
    expect(formatSequenceFilename(12)).toBe("012.md");
  });

  it("builds corpus draft and garden paths", () => {
    expect(corpusAgentDraftPath(odyssey, "/repo")).toBe(
      "/repo/.local/corpus/drafts/homer/odyssey/1-1.json",
    );
    expect(corpusGardenMarkdownPath(odyssey, "/repo")).toBe(
      "/repo/.local/corpus/garden/homer/odyssey/book-1/001.md",
    );
  });

  it("builds legacy agent draft path", () => {
    expect(legacyAgentDraftPath(odyssey, "/repo")).toBe(
      "/repo/.local/agent-drafts/odyssey/1-1.json",
    );
  });
});
