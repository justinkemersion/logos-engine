import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  LogosPassageAgentValidationError,
  runLogosPassageAgent,
} from "@/lib/agents/logos-passage-agent-core";
import {
  corpusAgentDraftPath,
  corpusGardenMarkdownPath,
} from "@/lib/corpus/garden-path";
import { manifestEntryToPassageInput, type ResolvedManifestEntry } from "@/lib/corpus/manifest";
import { readDraftJsonForEntry, todayIsoDate } from "@/lib/corpus/read-draft-json";
import {
  parseGardenFrontmatter,
  renderPassageMarkdown,
} from "@/lib/corpus/render-passage-markdown";

export type GenerateEntryResult =
  | { ok: true; citation: string; skipped: boolean }
  | { ok: false; citation: string; error: string };

export async function generateCorpusEntry(
  entry: ResolvedManifestEntry,
  options: { force?: boolean } = {},
): Promise<GenerateEntryResult> {
  const force = options.force ?? false;
  const draftPath = corpusAgentDraftPath(entry);
  const gardenPath = corpusGardenMarkdownPath(entry);
  let skipped = false;

  let draft;
  let generatedByModel = "unknown";

  if (existsSync(gardenPath)) {
    generatedByModel =
      parseGardenFrontmatter(readFileSync(gardenPath, "utf8")).generatedByModel ??
      generatedByModel;
  }

  if (existsSync(draftPath) && !force) {
    skipped = true;
    try {
      ({ draft } = readDraftJsonForEntry(entry));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, citation: entry.citation, error: message };
    }
  } else {
    const input = manifestEntryToPassageInput(entry);
    try {
      const result = await runLogosPassageAgent(input);
      draft = result.draft;
      generatedByModel = result.model;
      mkdirSync(dirname(draftPath), { recursive: true });
      writeFileSync(draftPath, JSON.stringify(draft, null, 2), "utf8");
    } catch (error) {
      if (error instanceof LogosPassageAgentValidationError) {
        return {
          ok: false,
          citation: entry.citation,
          error: error.message,
        };
      }
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, citation: entry.citation, error: message };
    }
  }

  try {
    const markdown = renderPassageMarkdown(entry, draft!, {
      generatedAt: todayIsoDate(),
      generatedByModel,
    });
    mkdirSync(dirname(gardenPath), { recursive: true });
    writeFileSync(gardenPath, markdown, "utf8");
    return { ok: true, citation: entry.citation, skipped };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, citation: entry.citation, error: message };
  }
}
