#!/usr/bin/env tsx
/**
 * Sync corpus section manifest Greek from Scaife / Perseus (perseus-grc2).
 *
 * Usage:
 *   pnpm corpus:sync:republic-book-1
 *   pnpm corpus:sync:odyssey-book-1
 *   pnpm corpus:sync:iliad-book-1
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildSectionManifestYaml } from "@/lib/corpus/manifest-yaml";
import {
  fetchEpicBookLineRefs,
  fetchRepublicBook1PageNumbers,
  fetchScaifePassage,
  SCAIFE_EDITIONS,
  type ScaifeEditionKey,
} from "@/lib/corpus/scaife";

const CORPUS_ROOT = join(process.cwd(), "corpus");

async function syncWithFetcher(
  label: string,
  manifestPath: string,
  header: string,
  meta: Parameters<typeof buildSectionManifestYaml>[1],
  edition: ScaifeEditionKey,
  fetchUnits: () => AsyncGenerator<{ citation: string; sectionRef: string }>,
): Promise<void> {
  const passages: { citation: string; sequence: number; greek: string }[] = [];
  let sequence = 0;

  for await (const unit of fetchUnits()) {
    sequence += 1;
    process.stderr.write(`  ${unit.sectionRef}… `);
    const greek = await fetchScaifePassage(edition, unit.sectionRef, {
      retries: 4,
      delayMs: 500,
    });
    passages.push({ citation: unit.citation, sequence, greek });
    console.error(`${greek.split(/\s+/).length} words`);
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  const yaml = buildSectionManifestYaml(header, meta, passages);
  writeFileSync(manifestPath, yaml, "utf8");
  console.error(`\nWrote ${passages.length} passages to ${manifestPath} (${label})`);
}

async function* republicUnits(): AsyncGenerator<{ citation: string; sectionRef: string }> {
  const pages = await fetchRepublicBook1PageNumbers();
  console.error(
    `Fetching ${pages.length} Stephanus pages (${pages[0]}–${pages.at(-1)})…`,
  );
  for (const page of pages) {
    yield { citation: String(page), sectionRef: `1.${page}` };
  }
}

async function* epicUnits(
  edition: "odyssey" | "iliad",
): AsyncGenerator<{ citation: string; sectionRef: string }> {
  const lines = await fetchEpicBookLineRefs(edition, 1);
  console.error(
    `Fetching ${lines.length} lines (${lines[0]?.citation}–${lines.at(-1)?.citation})…`,
  );
  for (const line of lines) {
    yield { citation: line.citation, sectionRef: line.sectionRef };
  }
}

async function syncRepublicBook1(): Promise<void> {
  const edition = SCAIFE_EDITIONS.republic;
  await syncWithFetcher(
    "Republic Book I",
    join(CORPUS_ROOT, "plato", "republic", "book-1", "manifest.yaml"),
    `# Republic Book I — synced from Perseus Scaife (perseus-grc2).
# Source: ${edition.readerUrl}
# Units: Stephanus pages (refine into argumentative movements per SEGMENTATION.md).
# Re-sync: pnpm corpus:sync:republic-book-1`,
    {
      author: "Plato",
      author_slug: "plato",
      work: "Republic",
      work_slug: "republic",
      section_slug: "book-1",
      section_title: "Book I",
      book: 1,
    },
    "republic",
    republicUnits,
  );
}

async function syncOdysseyBook1(): Promise<void> {
  const edition = SCAIFE_EDITIONS.odyssey;
  await syncWithFetcher(
    "Odyssey Book I",
    join(CORPUS_ROOT, "homer", "odyssey", "book-1", "manifest.yaml"),
    `# Odyssey Book I — synced from Perseus Scaife (perseus-grc2).
# Source: ${edition.readerUrl}
# Units: Homeric lines (one line per passage).
# Re-sync: pnpm corpus:sync:odyssey-book-1`,
    {
      author: "Homer",
      author_slug: "homer",
      work: "Odyssey",
      work_slug: "odyssey",
      section_slug: "book-1",
      section_title: "Book 1",
      book: 1,
    },
    "odyssey",
    () => epicUnits("odyssey"),
  );
}

async function syncIliadBook1(): Promise<void> {
  const edition = SCAIFE_EDITIONS.iliad;
  await syncWithFetcher(
    "Iliad Book I",
    join(CORPUS_ROOT, "homer", "iliad", "book-1", "manifest.yaml"),
    `# Iliad Book I — synced from Perseus Scaife (perseus-grc2).
# Source: ${edition.readerUrl}
# Units: Homeric lines (one line per passage).
# Re-sync: pnpm corpus:sync:iliad-book-1`,
    {
      author: "Homer",
      author_slug: "homer",
      work: "Iliad",
      work_slug: "iliad",
      section_slug: "book-1",
      section_title: "Book 1",
      book: 1,
    },
    "iliad",
    () => epicUnits("iliad"),
  );
}

const TARGETS: Record<string, () => Promise<void>> = {
  "republic-book-1": syncRepublicBook1,
  "odyssey-book-1": syncOdysseyBook1,
  "iliad-book-1": syncIliadBook1,
};

async function main(): Promise<void> {
  const argv = process.argv.slice(2).filter((arg) => arg !== "--");
  const target = argv[0] ?? "republic-book-1";
  const runner = TARGETS[target];

  if (!runner) {
    console.error(`Unknown target: ${target}`);
    console.error(
      `Usage: pnpm corpus:sync:perseus -- [${Object.keys(TARGETS).join("|")}]`,
    );
    process.exit(2);
  }

  await runner();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
