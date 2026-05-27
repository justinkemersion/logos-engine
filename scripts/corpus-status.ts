#!/usr/bin/env tsx
/**
 * Summarize manifest vs drafts vs garden per section.
 *
 * Usage:
 *   pnpm corpus:status
 *   pnpm corpus:status -- --work-slug=odyssey --section=book-1
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadAllCorpusEntries } from "@/lib/corpus/load-manifest";
import { corpusAgentDraftPath, corpusGardenMarkdownPath } from "@/lib/corpus/garden-path";

function parseArgs(argv: string[]): {
  workSlug?: string;
  sectionSlug?: string;
} {
  let workSlug: string | undefined;
  let sectionSlug: string | undefined;

  for (const arg of argv) {
    if (arg.startsWith("--work-slug=")) {
      workSlug = arg.slice("--work-slug=".length);
      continue;
    }
    if (arg.startsWith("--section=")) {
      sectionSlug = arg.slice("--section=".length);
      continue;
    }
  }

  return { workSlug, sectionSlug };
}

function failedCountFromLog(workSlug: string, sectionSlug: string): number {
  const logFile = join(
    process.cwd(),
    ".local",
    "corpus",
    `generate-${workSlug}-${sectionSlug}.log`,
  );
  if (!existsSync(logFile)) {
    return 0;
  }
  const content = readFileSync(logFile, "utf8");
  return content.split("\n").filter((line) => line.startsWith("FAILED ")).length;
}

function main(): void {
  const argv = process.argv.slice(2).filter((arg) => arg !== "--");
  const { workSlug, sectionSlug } = parseArgs(argv);

  const entries = loadAllCorpusEntries().filter((entry) => {
    if (workSlug && entry.work_slug !== workSlug) {
      return false;
    }
    if (sectionSlug && entry.section_slug !== sectionSlug) {
      return false;
    }
    return true;
  });

  const groups = new Map<string, typeof entries>();
  for (const entry of entries) {
    const key = `${entry.author_slug}/${entry.work_slug}/${entry.section_slug}`;
    const list = groups.get(key) ?? [];
    list.push(entry);
    groups.set(key, list);
  }

  if (groups.size === 0) {
    console.log("No manifest entries found.");
    return;
  }

  for (const [key, list] of [...groups.entries()].sort()) {
    let drafts = 0;
    let garden = 0;
    for (const entry of list) {
      if (existsSync(corpusAgentDraftPath(entry))) {
        drafts += 1;
      }
      if (existsSync(corpusGardenMarkdownPath(entry))) {
        garden += 1;
      }
    }
    const sample = list[0]!;
    const failed = failedCountFromLog(sample.work_slug, sample.section_slug);
    console.log(
      `${key}: manifest=${list.length} drafts=${drafts} garden=${garden} failed_log=${failed}`,
    );
  }
}

main();
