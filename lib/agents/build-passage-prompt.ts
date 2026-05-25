import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PassageInput } from "./logos-passage-draft";

const PROMPT_PATH = join(process.cwd(), "prompts", "logos-passage-agent.md");

function loadAgentInstructions(): string {
  return readFileSync(PROMPT_PATH, "utf8");
}

export function buildPassagePrompt(input: PassageInput): {
  system: string;
  user: string;
  combined: string;
} {
  const system = loadAgentInstructions();
  const user = [
    "Analyze the following passage and return structured JSON only.",
    "",
    JSON.stringify(input, null, 2),
  ].join("\n");
  const combined = `${system}\n\n---\n\n${user}`;
  return { system, user, combined };
}
