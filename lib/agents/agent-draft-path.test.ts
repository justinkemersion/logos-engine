import { describe, expect, it } from "vitest";
import { defaultAgentDraftPath, slugifyAgentDraftSegment } from "./agent-draft-path";

describe("agent-draft-path", () => {
  it("slugifies work titles and citations", () => {
    expect(slugifyAgentDraftSegment("Odyssey")).toBe("odyssey");
    expect(slugifyAgentDraftSegment("Republic 327a")).toBe("republic-327a");
    expect(slugifyAgentDraftSegment("1.1")).toBe("1-1");
  });

  it("builds default path under .local/agent-drafts", () => {
    expect(
      defaultAgentDraftPath(
        { workTitle: "Odyssey", citation: "1.1" },
        "/repo",
      ),
    ).toBe("/repo/.local/agent-drafts/odyssey/1-1.json");
    expect(
      defaultAgentDraftPath(
        { workTitle: "Republic", citation: "327a" },
        "/repo",
      ),
    ).toBe("/repo/.local/agent-drafts/republic/327a.json");
  });
});
