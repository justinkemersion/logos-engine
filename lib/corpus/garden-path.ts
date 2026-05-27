import { existsSync } from "node:fs";
import { join } from "node:path";
import { slugifyAgentDraftSegment } from "@/lib/agents/agent-draft-path";
import type { ResolvedManifestEntry } from "./manifest";

const CORPUS_ROOT = ".local/corpus";

export function formatSequenceFilename(sequence: number): string {
  return `${String(sequence).padStart(3, "0")}.md`;
}

export function corpusRoot(root = process.cwd()): string {
  return join(root, CORPUS_ROOT);
}

export function corpusDraftsDir(root = process.cwd()): string {
  return join(corpusRoot(root), "drafts");
}

export function corpusGardenDir(root = process.cwd()): string {
  return join(corpusRoot(root), "garden");
}

export function corpusExportsDir(root = process.cwd()): string {
  return join(corpusRoot(root), "exports");
}

export function corpusAgentDraftPath(
  entry: Pick<
    ResolvedManifestEntry,
    "author_slug" | "work_slug" | "citation"
  >,
  root = process.cwd(),
): string {
  const citation = slugifyAgentDraftSegment(entry.citation) || "passage";
  return join(
    corpusDraftsDir(root),
    entry.author_slug,
    entry.work_slug,
    `${citation}.json`,
  );
}

export function legacyAgentDraftPath(
  entry: Pick<ResolvedManifestEntry, "work_slug" | "citation">,
  root = process.cwd(),
): string {
  const citation = slugifyAgentDraftSegment(entry.citation) || "passage";
  return join(
    root,
    ".local",
    "agent-drafts",
    entry.work_slug,
    `${citation}.json`,
  );
}

/** Prefer `.local/corpus/drafts/`; fall back to legacy `.local/agent-drafts/`. */
export function resolveAgentDraftPath(
  entry: Pick<
    ResolvedManifestEntry,
    "author_slug" | "work_slug" | "citation"
  >,
  root = process.cwd(),
): string | null {
  const primary = corpusAgentDraftPath(entry, root);
  if (existsSync(primary)) {
    return primary;
  }

  const legacy = legacyAgentDraftPath(entry, root);
  if (existsSync(legacy)) {
    return legacy;
  }

  return null;
}

export function corpusGardenMarkdownPath(
  entry: Pick<
    ResolvedManifestEntry,
    "author_slug" | "work_slug" | "section_slug" | "sequence"
  >,
  root = process.cwd(),
): string {
  return join(
    corpusGardenDir(root),
    entry.author_slug,
    entry.work_slug,
    entry.section_slug,
    formatSequenceFilename(entry.sequence),
  );
}
