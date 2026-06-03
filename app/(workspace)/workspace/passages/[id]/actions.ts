"use server";

import { revalidatePath } from "next/cache";
import { requireSessionSub } from "@/lib/flux/auth";
import {
  ensureDefaultWorkspace,
  upsertWorkspaceLayer,
  createWorkspaceCommentary,
  updateWorkspaceCommentary,
} from "@/lib/flux/workspaces";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function saveWorkspaceLayerAction(input: {
  passageId: string;
  workspaceId: string;
  layer: string;
  content: string;
}): Promise<ActionResult> {
  try {
    const sub = await requireSessionSub();
    const workspace = await ensureDefaultWorkspace(sub);
    if (workspace.id !== input.workspaceId) {
      return { ok: false, error: "Workspace not found." };
    }
    await upsertWorkspaceLayer(
      sub,
      input.workspaceId,
      input.passageId,
      input.layer,
      input.content,
    );
    revalidatePath(`/workspace/passages/${input.passageId}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function saveWorkspaceCommentaryAction(input: {
  passageId: string;
  workspaceId: string;
  title: string | null;
  body: string;
}): Promise<ActionResult> {
  try {
    const sub = await requireSessionSub();
    const workspace = await ensureDefaultWorkspace(sub);
    if (workspace.id !== input.workspaceId) {
      return { ok: false, error: "Workspace not found." };
    }
    await createWorkspaceCommentary(sub, input.workspaceId, input.passageId, {
      title: input.title,
      body: input.body,
    });
    revalidatePath(`/workspace/passages/${input.passageId}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function updateWorkspaceCommentaryAction(input: {
  noteId: string;
  passageId: string;
  body: string;
}): Promise<ActionResult> {
  try {
    const sub = await requireSessionSub();
    await updateWorkspaceCommentary(sub, input.noteId, { body: input.body });
    revalidatePath(`/workspace/passages/${input.passageId}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Update failed." };
  }
}
