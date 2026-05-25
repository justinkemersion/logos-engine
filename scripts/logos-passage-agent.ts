#!/usr/bin/env tsx
/**
 * Run logos-passage-agent against a Greek passage and write validated JSON.
 *
 * Usage:
 *   pnpm agent:passage -- --work-title="Odyssey" --citation="1.1" \
 *     --author="Homer" --greek="ἄνδρα μοι ἔννεπε, Μοῦσα, πολύτροπον"
 *
 * By default writes to `.local/agent-drafts/{work}/{citation}.json` (gitignored).
 *
 * Options:
 *   --decompose   Also print granular ai_runs payloads
 *   --stdout      Print draft JSON to stdout instead of writing a file
 *   --out=path    Override output path
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { loadEnvFiles } from "./lib/load-env";
import { defaultAgentDraftPath } from "@/lib/agents/agent-draft-path";
import { decomposePassageDraft } from "@/lib/agents/decompose-passage-draft";
import {
  LogosPassageAgentValidationError,
  runLogosPassageAgent,
} from "@/lib/agents/logos-passage-agent-core";
import type { PassageInput } from "@/lib/agents/logos-passage-draft";

loadEnvFiles();

function usage(): never {
  console.error(
    [
      "Usage: pnpm agent:passage -- [options]",
      "",
      "Required:",
      '  --work-title="Title"',
      '  --citation="1.1"',
      '  --greek="Greek text"',
      "",
      "Optional:",
      '  --author="Author"',
      "  --decompose",
      "  --stdout          Print JSON to stdout (no file write)",
      "  --out=path.json   Override default .local/agent-drafts/... path",
    ].join("\n"),
  );
  process.exit(2);
}

function parseArgs(argv: string[]): {
  input: PassageInput;
  decompose: boolean;
  stdout: boolean;
  outPath?: string;
} {
  let workTitle: string | undefined;
  let citation: string | undefined;
  let greekText: string | undefined;
  let author: string | undefined;
  let decompose = false;
  let stdout = false;
  let outPath: string | undefined;

  for (const arg of argv) {
    if (arg === "--decompose") {
      decompose = true;
      continue;
    }
    if (arg === "--stdout") {
      stdout = true;
      continue;
    }
    if (arg.startsWith("--out=")) {
      outPath = arg.slice("--out=".length);
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
    if (arg.startsWith("--greek=")) {
      greekText = arg.slice("--greek=".length);
      continue;
    }
    if (arg.startsWith("--author=")) {
      author = arg.slice("--author=".length);
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    usage();
  }

  if (!workTitle || !citation || !greekText) {
    usage();
  }

  const input: PassageInput = { workTitle, citation, greekText };
  if (author) input.author = author;
  return { input, decompose, stdout, outPath };
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2).filter((arg) => arg !== "--");
  const { input, decompose, stdout, outPath } = parseArgs(argv);

  try {
    const { draft } = await runLogosPassageAgent(input);
    const json = JSON.stringify(draft, null, 2);

    if (stdout) {
      console.log(json);
    } else {
      const target = outPath ?? defaultAgentDraftPath(input);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, json, "utf8");
      console.error(`Wrote draft to ${target}`);
    }

    if (decompose) {
      const payloads = decomposePassageDraft(draft);
      console.error("\n--- decomposed payloads ---\n");
      for (const p of payloads) {
        console.error(`[${p.runType}]`);
        console.log(p.output);
        console.log("");
      }
    }
  } catch (error) {
    if (error instanceof LogosPassageAgentValidationError) {
      console.error(`Validation error: ${error.message}`);
      if (error.rawOutput) {
        console.error("\n--- raw agent output ---\n");
        console.error(error.rawOutput);
      }
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
    process.exit(1);
  }
}

main();
