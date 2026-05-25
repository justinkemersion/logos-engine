import { beforeEach, describe, expect, it, vi } from "vitest";
import { odyssey11Fixture } from "./fixtures/odyssey-1-1";

const createAiRun = vi.fn();

vi.mock("@/lib/flux/ai-runs", () => ({
  createAiRun: (...args: unknown[]) => createAiRun(...args),
}));

import { persistPassageDraftToAiRuns } from "./persist-passage-draft-core";

describe("persistPassageDraftToAiRuns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createAiRun.mockResolvedValue({ id: "run-1", run_type: "passage_draft" });
  });

  it("creates master passage_draft row", async () => {
    await persistPassageDraftToAiRuns("sub-1", "passage-1", odyssey11Fixture, {
      model: "test",
      prompt: "prompt",
    });

    expect(createAiRun).toHaveBeenCalledWith("sub-1", expect.objectContaining({
      passage_id: "passage-1",
      run_type: "passage_draft",
      model: "test",
      prompt: "prompt",
      output: expect.stringContaining('"tokens"'),
    }));
  });

  it("creates decomposed rows when requested", async () => {
    await persistPassageDraftToAiRuns(
      "sub-1",
      "passage-1",
      odyssey11Fixture,
      { model: "test" },
      { decompose: true },
    );

    expect(createAiRun.mock.calls.length).toBeGreaterThan(1);
    expect(createAiRun.mock.calls.some((call) => call[1].run_type === "token_gloss")).toBe(true);
  });
});
