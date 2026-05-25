import "server-only";

import { getPassage } from "@/lib/flux/passages";
import { getWork } from "@/lib/flux/works";
import { persistPassageDraftToAiRuns } from "./persist-passage-draft-core";
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

  return persistPassageDraftToAiRuns(
    sub,
    passageId,
    draft,
    { model, prompt },
    options,
  );
}
