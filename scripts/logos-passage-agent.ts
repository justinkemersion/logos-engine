#!/usr/bin/env tsx
/**
 * Run logos-passage-agent against a Greek passage and print validated JSON.
 *
 * Usage:
 *   pnpm agent:passage -- --work-title="Odyssey" --citation="1.1" \
 *     --author="Homer" --greek="ἄνδρα μοι ἔννεπε, Μοῦσα, πολύτροπον"
 *
 * Options:
 *   --decompose   Also print granular ai_runs payloads
 *   --out=path    Write draft JSON to file
 */
import { writeFileSync } from "node:fs";
import { loadEnvFiles } from "./lib/load-env";
import { decomposePassageDraft } from "@/lib/agents/decompose-passage-draft";
import {
  LogosPassageAgentValidationError,
  runLogosPassageAgent,
} from "@/lib/agents/logos-passage-agent";
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
      "  --out=path.json",
    ].join("\n"),
  );
  process.exit(2);
}

function parseArgs(argv: string[]): {
  input: PassageInput;
  decompose: boolean;
  outPath?: string;
} {
  let workTitle: string | undefined;
  let citation: string | undefined;
  let greekText: string | undefined;
  let author: string | undefined;
  let decompose = false;
  let outPath: string | undefined;

  for (const arg of argv) {
    if (arg === "--decompose") {
      decompose = true;
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
  return { input, decompose, outPath };
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2).filter((arg) => arg !== "--");
  const { input, decompose, outPath } = parseArgs(argv);

  try {
    const { draft } = await runLogosPassageAgent(input);
    const json = JSON.stringify(draft, null, 2);

    if (outPath) {
      writeFileSync(outPath, json, "utf8");
      console.error(`Wrote draft to ${outPath}`);
    } else {
      console.log(json);
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
