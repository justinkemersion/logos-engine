import "server-only";

import { getPassage } from "@/lib/flux/passages";
import { getWork } from "@/lib/flux/works";
import { createAiRun } from "@/lib/flux/ai-runs";
import { decomposePassageDraft } from "./decompose-passage-draft";
import { runLogosPassageAgent } from "./logos-passage-agent";
import type { PassageInput } from "./logos-passage-draft";
import type { AiRunRow } from "@/lib/types/entities";

export async function runAndPersistPassageDraft(
  sub: string,
  passageId: string,
  options?: { decompose?: boolean },
): Promise<AiRunRow> {
  const passage = await getPassage(sub, passageId);
  if (!passage) {
    throw new Error("Passage not found");
  }

  const work = await getWork(sub, passage.work_id);
  const input: PassageInput = {
    workTitle: work?.title ?? "Unknown",
    citation: passage.citation_ref,
    greekText: passage.greek_text,
    ...(work?.author ? { author: work.author } : {}),
  };

  const { draft, model, prompt } = await runLogosPassageAgent(input);

  const master = await createAiRun(sub, {
    passage_id: passageId,
    run_type: "passage_draft",
    model,
    prompt,
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
        model,
        prompt: null,
        output: payload.output,
      });
    }
  }

  return master;
}
