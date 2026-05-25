/** Optional granular ai_runs rows when persisting (off by default). */
export function shouldDecomposePassageDraft(): boolean {
  return process.env.LOGOS_PASSAGE_AGENT_DECOMPOSE === "1";
}

/** UI button — off until operator enables after persistence review. */
export function isPassageDraftUiEnabled(): boolean {
  return process.env.LOGOS_PASSAGE_DRAFT_UI_ENABLED === "1";
}
