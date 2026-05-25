import { createAiRun } from "@/lib/flux/ai-runs";
import { decomposePassageDraft } from "./decompose-passage-draft";
import type { LogosPassageDraft } from "./logos-passage-draft";
import type { AiRunRow } from "@/lib/types/entities";

export type PersistPassageDraftMeta = {
  model?: string | null;
  prompt?: string | null;
};

/** Persist validated draft JSON to ai_runs (master + optional decomposed rows). */
export async function persistPassageDraftToAiRuns(
  sub: string,
  passageId: string,
  draft: LogosPassageDraft,
  meta: PersistPassageDraftMeta = {},
  options?: { decompose?: boolean },
): Promise<AiRunRow> {
  const master = await createAiRun(sub, {
    passage_id: passageId,
    run_type: "passage_draft",
    model: meta.model ?? null,
    prompt: meta.prompt ?? null,
    output: JSON.stringify(draft, null, 2),
  });

  if (options?.decompose) {
    const payloads = decomposePassageDraft(draft).filter(
      (p) => p.runType !== "passage_draft",
    );
    for (const payload of payloads) {
      await createAiRun(sub, {
        passage_id: passageId,
        run_type: payload.runType,
        model: meta.model ?? null,
        prompt: null,
        output: payload.output,
      });
    }
  }

  return master;
}
