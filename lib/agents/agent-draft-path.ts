import { join } from "node:path";
import type { PassageInput } from "./logos-passage-draft";

/** Slug for filesystem paths under `.local/agent-drafts/`. */
export function slugifyAgentDraftSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Default on-disk location for CLI agent output (gitignored via `.local/`). */
export function defaultAgentDraftPath(
  input: Pick<PassageInput, "workTitle" | "citation">,
  root = process.cwd(),
): string {
  const work = slugifyAgentDraftSegment(input.workTitle);
  const citation = slugifyAgentDraftSegment(input.citation) || "passage";
  return join(root, ".local", "agent-drafts", work, `${citation}.json`);
}
