"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  LogosPassageAgentValidationError,
} from "@/lib/agents/logos-passage-agent";
import { parsePassageDraftOutput } from "@/lib/agents/parse-passage-draft-output";
import { runAndPersistPassageDraft } from "@/lib/agents/persist-passage-draft";
import {
  promotePassageDraft,
  type PromotePassageDraftSelection,
  type PromotionResult,
} from "@/lib/agents/promote-passage-draft";
import { shouldDecomposePassageDraft } from "@/lib/config/agent";
import type { ActionResult } from "@/lib/actions/result";
import { actionError } from "@/lib/actions/result";
import { getAiRun } from "@/lib/flux/ai-runs";
import { listConcepts } from "@/lib/flux/concepts";
import { listTokensForPassage } from "@/lib/flux/tokens";
import type { AiRunRow } from "@/lib/types/entities";

export async function generatePassageDraftAction(
  passageId: string,
): Promise<ActionResult<{ run: AiRunRow }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Not authenticated" };
  }

  if (!process.env.CURSOR_API_KEY?.trim()) {
    return { ok: false, error: "Draft generation is not configured" };
  }

  try {
    const run = await runAndPersistPassageDraft(session.user.id, passageId, {
      decompose: shouldDecomposePassageDraft(),
    });
    revalidatePath(`/passages/${passageId}`);
    return { ok: true, data: { run } };
  } catch (error) {
    if (error instanceof LogosPassageAgentValidationError) {
      return { ok: false, error: "Draft failed validation" };
    }
    if (error instanceof Error && error.message === "Passage not found") {
      return { ok: false, error: "Passage not found" };
    }
    return actionError("Draft generation failed");
  }
}

export async function promotePassageDraftAction(
  passageId: string,
  aiRunId: string,
  selection: PromotePassageDraftSelection,
): Promise<ActionResult<PromotionResult>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Not authenticated" };
  }

  const sub = session.user.id;
  const run = await getAiRun(sub, aiRunId);
  if (!run || run.passage_id !== passageId || run.run_type !== "passage_draft") {
    return { ok: false, error: "Draft run not found" };
  }

  const parsed = parsePassageDraftOutput(run.output);
  if (!parsed.ok) {
    return { ok: false, error: "Draft could not be parsed" };
  }

  try {
    const [tokens, concepts] = await Promise.all([
      listTokensForPassage(sub, passageId),
      listConcepts(sub),
    ]);
    const result = await promotePassageDraft(
      sub,
      passageId,
      aiRunId,
      parsed.draft,
      selection,
      { tokens, concepts },
    );
    revalidatePath(`/passages/${passageId}`);
    return { ok: true, data: result };
  } catch {
    return actionError("Promotion failed");
  }
}
