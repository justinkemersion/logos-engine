#!/usr/bin/env tsx
/**
 * Render Corpus Garden markdown from existing JSON drafts and manifest entries.
 *
 * Usage:
 *   pnpm corpus:render -- --work-slug=odyssey --citation=1.1
 *   pnpm corpus:render -- --all
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  filterManifestEntries,
  loadAllCorpusEntries,
  type ManifestFilter,
} from "@/lib/corpus/load-manifest";
import {
  corpusGardenMarkdownPath,
  resolveAgentDraftPath,
} from "@/lib/corpus/garden-path";
import { readDraftJsonForEntry, todayIsoDate } from "@/lib/corpus/read-draft-json";
import {
  parseGardenFrontmatter,
  renderPassageMarkdown,
} from "@/lib/corpus/render-passage-markdown";
import { computeSourceHash } from "@/lib/corpus/source-hash";

function usage(): never {
  console.error(
    [
      "Usage: pnpm corpus:render -- [options]",
      "",
      "Select passages (one required):",
      "  --all",
      "  --work-slug=odyssey --citation=1.1",
      "  --work-slug=odyssey --section=book-1",
      "",
      "Optional filters (with --all or --work-slug + --section):",
      "  --author-slug=homer",
      "  --section=book-1",
      "",
      "Optional:",
      "  --generated-by-model=...  Override model in frontmatter (default: existing or unknown)",
    ].join("\n"),
  );
  process.exit(2);
}

function parseArgs(argv: string[]): {
  filter: ManifestFilter;
  generatedByModel?: string;
} {
  let all = false;
  let authorSlug: string | undefined;
  let workSlug: string | undefined;
  let citation: string | undefined;
  let sectionSlug: string | undefined;
  let generatedByModel: string | undefined;

  for (const arg of argv) {
    if (arg === "--all") {
      all = true;
      continue;
    }
    if (arg.startsWith("--author-slug=")) {
      authorSlug = arg.slice("--author-slug=".length);
      continue;
    }
    if (arg.startsWith("--work-slug=")) {
      workSlug = arg.slice("--work-slug=".length);
      continue;
    }
    if (arg.startsWith("--citation=")) {
      citation = arg.slice("--citation=".length);
      continue;
    }
    if (arg.startsWith("--section=")) {
      sectionSlug = arg.slice("--section=".length);
      continue;
    }
    if (arg.startsWith("--generated-by-model=")) {
      generatedByModel = arg.slice("--generated-by-model=".length);
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    usage();
  }

  if (!all && !(workSlug && citation) && !(workSlug && sectionSlug)) {
    usage();
  }

  return {
    filter: { all, authorSlug, workSlug, citation, sectionSlug },
    generatedByModel,
  };
}

function resolveGeneratedByModel(
  gardenPath: string,
  override?: string,
): string {
  if (override) {
    return override;
  }
  if (existsSync(gardenPath)) {
    const existing = readFileSync(gardenPath, "utf8");
    const parsed = parseGardenFrontmatter(existing);
    if (parsed.generatedByModel) {
      return parsed.generatedByModel;
    }
  }
  return "unknown";
}

function renderEntry(
  entry: ReturnType<typeof loadAllCorpusEntries>[number],
  generatedByModelOverride?: string,
): void {
  const gardenPath = corpusGardenMarkdownPath(entry);
  const expectedHash = computeSourceHash(entry);

  if (existsSync(gardenPath)) {
    const existing = readFileSync(gardenPath, "utf8");
    const parsed = parseGardenFrontmatter(existing);
    if (parsed.sourceHash && parsed.sourceHash !== expectedHash) {
      console.warn(
        `Warning: source_hash drift for ${entry.work} ${entry.citation} ` +
          `(manifest changed; existing ${parsed.sourceHash}, expected ${expectedHash})`,
      );
    }
  }

  const { path: draftPath, draft } = readDraftJsonForEntry(entry);
  const markdown = renderPassageMarkdown(entry, draft, {
    generatedAt: todayIsoDate(),
    generatedByModel: resolveGeneratedByModel(gardenPath, generatedByModelOverride),
  });

  mkdirSync(dirname(gardenPath), { recursive: true });
  writeFileSync(gardenPath, markdown, "utf8");
  console.error(`Rendered ${entry.work} ${entry.citation}`);
  console.error(`  draft:  ${draftPath}`);
  console.error(`  garden: ${gardenPath}`);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2).filter((arg) => arg !== "--");
  const { filter, generatedByModel } = parseArgs(argv);

  const entries = filterManifestEntries(loadAllCorpusEntries(), filter);

  if (entries.length === 0) {
    console.error("No manifest entries matched the filter.");
    process.exit(1);
  }

  for (const entry of entries) {
    if (!resolveAgentDraftPath(entry)) {
      console.error(
        `Skipping ${entry.work} ${entry.citation}: no JSON draft found.`,
      );
      continue;
    }
    renderEntry(entry, generatedByModel);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
