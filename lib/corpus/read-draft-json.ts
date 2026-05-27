import { readFileSync } from "node:fs";
import { parseLogosPassageDraft } from "@/lib/agents/logos-passage-draft";
import { resolveAgentDraftPath } from "./garden-path";
import type { ResolvedManifestEntry } from "./manifest";

export function readDraftJsonForEntry(
  entry: ResolvedManifestEntry,
  root = process.cwd(),
): { path: string; draft: ReturnType<typeof parseLogosPassageDraft> } {
  const path = resolveAgentDraftPath(entry, root);
  if (!path) {
    throw new Error(
      `No JSON draft found for ${entry.work} ${entry.citation}. ` +
        `Expected ${entry.author_slug}/${entry.work_slug} under .local/corpus/drafts/ ` +
        `or legacy .local/agent-drafts/${entry.work_slug}/.`,
    );
  }

  const raw = readFileSync(path, "utf8");
  const draft = parseLogosPassageDraft(JSON.parse(raw));
  return { path, draft };
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}
