import { buildPassagePrompt } from "./build-passage-prompt";
import { extractJsonFromAgentOutput } from "./extract-json";
import {
  parseLogosPassageDraft,
  type LogosPassageDraft,
  type PassageInput,
} from "./logos-passage-draft";

const DEFAULT_MODEL = "composer-2.5";

export type LogosPassageAgentResult = {
  draft: LogosPassageDraft;
  rawOutput: string;
  model: string;
  prompt: string;
};

export class LogosPassageAgentValidationError extends Error {
  readonly rawOutput: string;

  constructor(message: string, rawOutput: string) {
    super(message);
    this.name = "LogosPassageAgentValidationError";
    this.rawOutput = rawOutput;
  }
}

export async function runLogosPassageAgent(
  input: PassageInput,
  options?: { apiKey?: string; model?: string },
): Promise<LogosPassageAgentResult> {
  const apiKey = options?.apiKey ?? process.env.CURSOR_API_KEY;
  if (!apiKey) {
    throw new Error("CURSOR_API_KEY is required to run logos-passage-agent");
  }

  const model = options?.model ?? DEFAULT_MODEL;
  const { combined: prompt } = buildPassagePrompt(input);

  const { Agent, CursorAgentError } = await import("@cursor/sdk");

  let result;
  try {
    result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: model },
      local: { cwd: process.cwd(), settingSources: [] },
    });
  } catch (error) {
    if (error instanceof CursorAgentError) {
      throw new Error(`Agent failed to start: ${error.message}`, { cause: error });
    }
    throw error;
  }

  if (result.status === "error") {
    throw new Error(`Agent run failed: ${result.result ?? "unknown error"}`);
  }

  const rawOutput = result.result ?? "";
  if (!rawOutput.trim()) {
    throw new LogosPassageAgentValidationError("Agent returned empty output", rawOutput);
  }

  let parsed: unknown;
  try {
    parsed = extractJsonFromAgentOutput(rawOutput);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    throw new LogosPassageAgentValidationError(
      `Failed to parse agent JSON: ${message}`,
      rawOutput,
    );
  }

  try {
    const draft = parseLogosPassageDraft(parsed);
    return { draft, rawOutput, model, prompt };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Schema validation failed";
    throw new LogosPassageAgentValidationError(
      `Draft failed validation: ${message}`,
      rawOutput,
    );
  }
}
