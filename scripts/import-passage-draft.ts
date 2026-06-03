#!/usr/bin/env tsx
/**
 * Import a local LogosPassageDraft JSON file into ai_runs.
 *
 * Usage:
 *   pnpm agent:passage:import -- --passage-id=<uuid> --work-title=Odyssey --citation=1.1
 *
 * Reads from corpus drafts, legacy agent-drafts, --file=, or --work-title + --citation.
 */
import { readFileSync } from "node:fs";
import { loadEnvFiles } from "./lib/load-env";
import { defaultAgentDraftPath } from "@/lib/agents/agent-draft-path";
import { resolveAgentDraftPath } from "@/lib/corpus/garden-path";
import { parsePassageDraftOutput } from "@/lib/agents/parse-passage-draft-output";
import { persistPassageDraftToAiRuns } from "@/lib/agents/persist-passage-draft-core";

loadEnvFiles();

const DEFAULT_SUB = "logos-cli-operator";

function usage(): never {
  console.error(
    [
      "Usage: pnpm agent:passage:import -- [options]",
      "",
      "Required:",
      "  --passage-id=<uuid>",
      "",
      "Draft file (one required pair):",
      "  --file=path.json",
      "  --work-title=... --citation=...  (default .local/agent-drafts path)",
      "",
      "Optional:",
      "  --decompose",
      "  --sub=...           JWT sub (default LOGOS_FLUX_SUB or logos-cli-operator)",
      "  --model=...",
      "  --prompt=...",
    ].join("\n"),
  );
  process.exit(2);
}

function parseArgs(argv: string[]): {
  passageId: string;
  filePath: string;
  decompose: boolean;
  sub: string;
  model?: string;
  prompt?: string;
} {
  let passageId: string | undefined;
  let filePath: string | undefined;
  let workTitle: string | undefined;
  let citation: string | undefined;
  let authorSlug: string | undefined;
  let workSlug: string | undefined;
  let decompose = false;
  let sub = process.env.LOGOS_FLUX_SUB?.trim() || DEFAULT_SUB;
  let model: string | undefined;
  let prompt: string | undefined;

  for (const arg of argv) {
    if (arg === "--decompose") {
      decompose = true;
      continue;
    }
    if (arg.startsWith("--passage-id=")) {
      passageId = arg.slice("--passage-id=".length);
      continue;
    }
    if (arg.startsWith("--file=")) {
      filePath = arg.slice("--file=".length);
      continue;
    }
    if (arg.startsWith("--work-title=")) {
      workTitle = arg.slice("--work-title=".length);
      continue;
    }
    if (arg.startsWith("--citation=")) {
      citation = arg.slice("--citation=".length);
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
    if (arg.startsWith("--sub=")) {
      sub = arg.slice("--sub=".length);
      continue;
    }
    if (arg.startsWith("--model=")) {
      model = arg.slice("--model=".length);
      continue;
    }
    if (arg.startsWith("--prompt=")) {
      prompt = arg.slice("--prompt=".length);
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    usage();
  }

  if (!passageId) {
    usage();
  }

  if (!filePath) {
    if (authorSlug && workSlug && citation) {
      const resolved = resolveAgentDraftPath({
        author_slug: authorSlug,
        work_slug: workSlug,
        citation,
      });
      if (!resolved) {
        console.error(
          `No corpus draft for ${authorSlug}/${workSlug} ${citation} (.local/corpus/drafts/ or agent-drafts/)`,
        );
        process.exit(1);
      }
      filePath = resolved;
    } else if (workTitle && citation) {
      filePath = defaultAgentDraftPath({ workTitle, citation });
    } else {
      console.error(
        "Provide --file=, --author-slug + --work-slug + --citation, or --work-title + --citation.",
      );
      usage();
    }
  }

  return { passageId, filePath, decompose, sub, model, prompt };
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2).filter((arg) => arg !== "--");
  const { passageId, filePath, decompose, sub, model, prompt } = parseArgs(argv);

  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch {
    console.error(`Could not read draft file: ${filePath}`);
    process.exit(1);
  }

  const parsed = parsePassageDraftOutput(raw);
  if (!parsed.ok) {
    console.error(`Invalid draft: ${parsed.error}`);
    process.exit(1);
  }

  try {
    const run = await persistPassageDraftToAiRuns(
      sub,
      passageId,
      parsed.draft,
      {
        model: model ?? "cli-import",
        prompt: prompt ?? `Imported from ${filePath}`,
      },
      { decompose },
    );
    console.log(`Imported passage_draft ai_run ${run.id} for passage ${passageId}`);
    console.log(`Source file: ${filePath}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
