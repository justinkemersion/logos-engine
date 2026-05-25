import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AiRunRow } from "@/lib/types/entities";

const fluxJson = vi.fn();

vi.mock("./client", () => ({
  fluxJson: (...args: unknown[]) => fluxJson(...args),
}));

import {
  createAiRun,
  getLatestAiRunForPassage,
  listAiRunsForPassage,
} from "./ai-runs";

const sampleRun: AiRunRow = {
  id: "run-1",
  passage_id: "passage-1",
  run_type: "passage_draft",
  model: "composer-2.5",
  prompt: "prompt text",
  output: '{"tokens":[]}',
  status: "draft",
  created_at: "2026-05-25T00:00:00.000Z",
};

beforeEach(() => {
  fluxJson.mockReset();
});

describe("createAiRun", () => {
  it("POSTs to /ai_runs with draft status default", async () => {
    fluxJson.mockResolvedValueOnce([sampleRun]);

    const row = await createAiRun("user-sub", {
      passage_id: "passage-1",
      run_type: "passage_draft",
      model: "composer-2.5",
      prompt: "prompt text",
      output: '{"tokens":[]}',
    });

    expect(row).toEqual(sampleRun);
    expect(fluxJson).toHaveBeenCalledWith("user-sub", "/ai_runs", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        status: "draft",
        passage_id: "passage-1",
        run_type: "passage_draft",
        model: "composer-2.5",
        prompt: "prompt text",
        output: '{"tokens":[]}',
      }),
    });
  });
});

describe("listAiRunsForPassage", () => {
  it("filters by passage_id and orders newest first", async () => {
    fluxJson.mockResolvedValueOnce([sampleRun]);

    await listAiRunsForPassage("user-sub", "passage-1");

    expect(fluxJson).toHaveBeenCalledWith(
      "user-sub",
      "/ai_runs?passage_id=eq.passage-1&order=created_at.desc",
    );
  });
});

describe("getLatestAiRunForPassage", () => {
  it("filters by passage_id and run_type with limit 1", async () => {
    fluxJson.mockResolvedValueOnce([sampleRun]);

    const row = await getLatestAiRunForPassage("user-sub", "passage-1", "passage_draft");

    expect(row).toEqual(sampleRun);
    expect(fluxJson).toHaveBeenCalledWith(
      "user-sub",
      "/ai_runs?passage_id=eq.passage-1&run_type=eq.passage_draft&order=created_at.desc&limit=1",
    );
  });

  it("returns null when no rows", async () => {
    fluxJson.mockResolvedValueOnce([]);

    const row = await getLatestAiRunForPassage("user-sub", "passage-1", "passage_draft");
    expect(row).toBeNull();
  });
});
