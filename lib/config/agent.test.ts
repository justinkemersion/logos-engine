import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { isPassageDraftUiEnabled, shouldDecomposePassageDraft } from "./agent";

describe("agent config", () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  it("UI generation stays disabled by default", () => {
    delete process.env.LOGOS_PASSAGE_DRAFT_UI_ENABLED;
    expect(isPassageDraftUiEnabled()).toBe(false);
  });

  it("UI generation follows LOGOS_PASSAGE_DRAFT_UI_ENABLED", () => {
    process.env.LOGOS_PASSAGE_DRAFT_UI_ENABLED = "1";
    expect(isPassageDraftUiEnabled()).toBe(true);
  });

  it("decompose follows LOGOS_PASSAGE_AGENT_DECOMPOSE", () => {
    delete process.env.LOGOS_PASSAGE_AGENT_DECOMPOSE;
    expect(shouldDecomposePassageDraft()).toBe(false);
    process.env.LOGOS_PASSAGE_AGENT_DECOMPOSE = "1";
    expect(shouldDecomposePassageDraft()).toBe(true);
  });
});
