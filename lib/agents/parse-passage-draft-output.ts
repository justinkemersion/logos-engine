import {
  logosPassageDraftSchema,
  type LogosPassageDraft,
} from "./logos-passage-draft";

export type PassageDraftParseResult =
  | { ok: true; draft: LogosPassageDraft }
  | { ok: false; error: string };

/** Parse ai_runs.output for run_type passage_draft. Safe for RSC loaders. */
export function parsePassageDraftOutput(output: string | null | undefined): PassageDraftParseResult {
  if (!output?.trim()) {
    return { ok: false, error: "No draft output stored" };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(output);
  } catch {
    return { ok: false, error: "Draft output is not valid JSON" };
  }

  const parsed = logosPassageDraftSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Draft output failed schema validation" };
  }

  return { ok: true, draft: parsed.data };
}
