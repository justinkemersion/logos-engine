"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  LogosPassageAgentValidationError,
} from "@/lib/agents/logos-passage-agent";
import { runAndPersistPassageDraft } from "@/lib/agents/persist-passage-draft";
import { shouldDecomposePassageDraft } from "@/lib/config/agent";
import type { ActionResult } from "@/lib/actions/result";
import { actionError } from "@/lib/actions/result";
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
