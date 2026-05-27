#!/usr/bin/env tsx
/**
 * Generate JSON drafts and render Corpus Garden markdown from manifest entries.
 */
import { mkdirSync } from "node:fs";
import { loadEnvFiles } from "./lib/load-env";
import {
  filterManifestEntries,
  loadAllCorpusEntries,
  type ManifestFilter,
} from "@/lib/corpus/load-manifest";
import { generateCorpusEntry } from "@/lib/corpus/generate-entry";
import { corpusExportsDir } from "@/lib/corpus/garden-path";

loadEnvFiles();

function usage(): never {
  console.error(
    [
      "Usage: pnpm corpus:generate -- [options]",
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
      "  --force                   Regenerate even if JSON draft exists",
    ].join("\n"),
  );
  process.exit(2);
}

function parseArgs(argv: string[]): { filter: ManifestFilter; force: boolean } {
  let all = false;
  let authorSlug: string | undefined;
  let workSlug: string | undefined;
  let citation: string | undefined;
  let sectionSlug: string | undefined;
  let force = false;

  for (const arg of argv) {
    if (arg === "--all") {
      all = true;
      continue;
    }
    if (arg === "--force") {
      force = true;
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
    console.error(`Unknown argument: ${arg}`);
    usage();
  }

  if (!all && !(workSlug && citation) && !(workSlug && sectionSlug)) {
    usage();
  }

  return { filter: { all, authorSlug, workSlug, citation, sectionSlug }, force };
}

async function main(): Promise<void> {
  mkdirSync(corpusExportsDir(), { recursive: true });

  const argv = process.argv.slice(2).filter((arg) => arg !== "--");
  const { filter, force } = parseArgs(argv);

  const entries = filterManifestEntries(loadAllCorpusEntries(), filter);

  if (entries.length === 0) {
    console.error("No manifest entries matched the filter.");
    process.exit(1);
  }

  let failed = 0;
  for (const entry of entries) {
    const result = await generateCorpusEntry(entry, { force });
    if (result.ok) {
      const label = result.skipped ? "SKIP" : "OK";
      console.error(`${label} ${entry.work} ${entry.citation}`);
    } else {
      failed += 1;
      console.error(`FAILED ${entry.work} ${entry.citation}: ${result.error}`);
      process.exit(1);
    }
  }

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
