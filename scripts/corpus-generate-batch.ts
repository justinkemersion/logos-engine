#!/usr/bin/env tsx
/**
 * Resumable batch corpus:generate — continues on error, logs progress.
 *
 * Usage:
 *   pnpm corpus:generate-batch -- --work-slug=odyssey --section=book-1
 *   pnpm corpus:generate-batch -- --work-slug=iliad --section=book-1 --from=1.1 --to=1.100
 *   pnpm corpus:generate-batch -- --work-slug=odyssey --section=book-1 --failed-only
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnvFiles } from "./lib/load-env";
import { filterManifestEntries, loadAllCorpusEntries } from "@/lib/corpus/load-manifest";
import { generateCorpusEntry } from "@/lib/corpus/generate-entry";
import { corpusExportsDir } from "@/lib/corpus/garden-path";
import { citationInRange } from "@/lib/corpus/scaife";

loadEnvFiles();

function usage(): never {
  console.error(
    [
      "Usage: pnpm corpus:generate-batch -- [options]",
      "",
      "Required:",
      "  --work-slug=odyssey --section=book-1",
      "",
      "Optional:",
      "  --from=1.1 --to=1.100       Citation range (epic lines or Stephanus pages)",
      "  --force                     Regenerate even if draft exists",
      "  --failed-only               Retry citations marked FAILED in log",
      "  --delay-ms=2000             Pause between agent calls (default 2000)",
    ].join("\n"),
  );
  process.exit(2);
}

function parseArgs(argv: string[]): {
  workSlug: string;
  sectionSlug: string;
  from?: string;
  to?: string;
  force: boolean;
  failedOnly: boolean;
  delayMs: number;
} {
  let workSlug: string | undefined;
  let sectionSlug: string | undefined;
  let from: string | undefined;
  let to: string | undefined;
  let force = false;
  let failedOnly = false;
  let delayMs = 2000;

  for (const arg of argv) {
    if (arg === "--force") {
      force = true;
      continue;
    }
    if (arg === "--failed-only") {
      failedOnly = true;
      continue;
    }
    if (arg.startsWith("--work-slug=")) {
      workSlug = arg.slice("--work-slug=".length);
      continue;
    }
    if (arg.startsWith("--section=")) {
      sectionSlug = arg.slice("--section=".length);
      continue;
    }
    if (arg.startsWith("--from=")) {
      from = arg.slice("--from=".length);
      continue;
    }
    if (arg.startsWith("--to=")) {
      to = arg.slice("--to=".length);
      continue;
    }
    if (arg.startsWith("--delay-ms=")) {
      delayMs = Number.parseInt(arg.slice("--delay-ms=".length), 10);
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    usage();
  }

  if (!workSlug || !sectionSlug) {
    usage();
  }

  return { workSlug, sectionSlug, from, to, force, failedOnly, delayMs };
}

function logPath(workSlug: string, sectionSlug: string): string {
  return join(
    process.cwd(),
    ".local",
    "corpus",
    `generate-${workSlug}-${sectionSlug}.log`,
  );
}

function failedCitationsFromLog(logFile: string): Set<string> {
  const failed = new Set<string>();
  if (!existsSync(logFile)) {
    return failed;
  }
  const content = readFileSync(logFile, "utf8");
  for (const line of content.split("\n")) {
    const match = line.match(/^FAILED\s+\S+\s+([^:]+):/);
    if (match?.[1]) {
      failed.add(match[1].trim());
    }
  }
  return failed;
}

function appendLog(logFile: string, line: string): void {
  appendFileSync(logFile, `${line}\n`, "utf8");
}

async function main(): Promise<void> {
  mkdirSync(corpusExportsDir(), { recursive: true });
  mkdirSync(join(process.cwd(), ".local", "corpus"), { recursive: true });

  const argv = process.argv.slice(2).filter((arg) => arg !== "--");
  const { workSlug, sectionSlug, from, to, force, failedOnly, delayMs } =
    parseArgs(argv);

  const logFile = logPath(workSlug, sectionSlug);
  const failedSet = failedOnly ? failedCitationsFromLog(logFile) : null;

  let entries = filterManifestEntries(loadAllCorpusEntries(), {
    workSlug,
    sectionSlug,
  });

  entries = entries.filter((entry) => citationInRange(entry.citation, from, to));

  if (failedOnly) {
    entries = entries.filter((entry) => failedSet?.has(entry.citation));
  }

  if (entries.length === 0) {
    console.error("No manifest entries matched the filter.");
    process.exit(1);
  }

  console.error(
    `Batch generate ${workSlug} ${sectionSlug}: ${entries.length} passages → ${logFile}`,
  );
  appendLog(logFile, `--- batch started ${new Date().toISOString()} ---`);

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    console.error(`[${i + 1}/${entries.length}] ${entry.work} ${entry.citation}…`);

    const result = await generateCorpusEntry(entry, { force });

    if (result.ok) {
      if (result.skipped) {
        skipped += 1;
        appendLog(logFile, `SKIP ${entry.work_slug} ${entry.citation}`);
        console.error(`  SKIP (draft exists)`);
      } else {
        ok += 1;
        appendLog(logFile, `OK ${entry.work_slug} ${entry.citation}`);
        console.error(`  OK`);
      }
    } else {
      failed += 1;
      appendLog(logFile, `FAILED ${entry.work_slug} ${entry.citation}: ${result.error}`);
      console.error(`  FAILED: ${result.error}`);
    }

    if (i < entries.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  const summary = `Done: OK=${ok} SKIP=${skipped} FAILED=${failed} total=${entries.length}`;
  appendLog(logFile, summary);
  console.error(`\n${summary}`);
  console.error(`Log: ${logFile}`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
