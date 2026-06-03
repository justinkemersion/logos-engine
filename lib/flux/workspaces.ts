import { fluxJson } from "./client";
import type {
  WorkspaceRow,
  WorkspaceTranslationLayerRow,
  WorkspaceTranslationVariantRow,
  WorkspaceCommentaryNoteRow,
} from "@/lib/types/workspaces";

export type {
  WorkspaceRow,
  WorkspaceTranslationLayerRow,
  WorkspaceTranslationVariantRow,
  WorkspaceCommentaryNoteRow,
} from "@/lib/types/workspaces";

const DEFAULT_SLUG = "default";
const DEFAULT_NAME = "My Logos Workspace";

export async function listWorkspacesByOwner(sub: string): Promise<WorkspaceRow[]> {
  return fluxJson<WorkspaceRow[]>(
    sub,
    `/workspaces?owner_sub=eq.${encodeURIComponent(sub)}&order=created_at.asc`,
  );
}

export async function getWorkspaceByOwnerAndSlug(
  sub: string,
  slug: string,
): Promise<WorkspaceRow | null> {
  const rows = await fluxJson<WorkspaceRow[]>(
    sub,
    `/workspaces?owner_sub=eq.${encodeURIComponent(sub)}&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function createWorkspace(
  sub: string,
  input: { slug: string; name: string },
): Promise<WorkspaceRow> {
  const rows = await fluxJson<WorkspaceRow[]>(sub, "/workspaces", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      owner_sub: sub,
      slug: input.slug,
      name: input.name,
    }),
  });
  const row = rows[0];
  if (!row) throw new Error("Flux POST /workspaces returned no row");
  return row;
}

/** Ensures the default personal workspace exists for this user. */
export async function ensureDefaultWorkspace(sub: string): Promise<WorkspaceRow> {
  const existing = await getWorkspaceByOwnerAndSlug(sub, DEFAULT_SLUG);
  if (existing) return existing;
  return createWorkspace(sub, { slug: DEFAULT_SLUG, name: DEFAULT_NAME });
}

export async function listWorkspaceLayers(
  sub: string,
  workspaceId: string,
  passageId: string,
): Promise<WorkspaceTranslationLayerRow[]> {
  return fluxJson<WorkspaceTranslationLayerRow[]>(
    sub,
    `/workspace_translation_layers?workspace_id=eq.${encodeURIComponent(workspaceId)}&passage_id=eq.${encodeURIComponent(passageId)}&order=layer.asc`,
  );
}

export async function findWorkspaceLayer(
  sub: string,
  workspaceId: string,
  passageId: string,
  layer: string,
): Promise<WorkspaceTranslationLayerRow | null> {
  const rows = await fluxJson<WorkspaceTranslationLayerRow[]>(
    sub,
    `/workspace_translation_layers?workspace_id=eq.${encodeURIComponent(workspaceId)}&passage_id=eq.${encodeURIComponent(passageId)}&layer=eq.${encodeURIComponent(layer)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function upsertWorkspaceLayer(
  sub: string,
  workspaceId: string,
  passageId: string,
  layer: string,
  content: string,
): Promise<WorkspaceTranslationLayerRow> {
  const existing = await findWorkspaceLayer(sub, workspaceId, passageId, layer);
  if (existing) {
    const rows = await fluxJson<WorkspaceTranslationLayerRow[]>(
      sub,
      `/workspace_translation_layers?id=eq.${encodeURIComponent(existing.id)}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ content, updated_at: new Date().toISOString() }),
      },
    );
    const row = rows[0];
    if (!row) throw new Error("Flux PATCH workspace_translation_layers returned no row");
    return row;
  }
  const rows = await fluxJson<WorkspaceTranslationLayerRow[]>(
    sub,
    "/workspace_translation_layers",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        workspace_id: workspaceId,
        passage_id: passageId,
        layer,
        content,
        status: "draft",
      }),
    },
  );
  const row = rows[0];
  if (!row) throw new Error("Flux POST workspace_translation_layers returned no row");
  return row;
}

export async function listWorkspaceCommentary(
  sub: string,
  workspaceId: string,
  passageId: string,
): Promise<WorkspaceCommentaryNoteRow[]> {
  return fluxJson<WorkspaceCommentaryNoteRow[]>(
    sub,
    `/workspace_commentary_notes?workspace_id=eq.${encodeURIComponent(workspaceId)}&passage_id=eq.${encodeURIComponent(passageId)}&order=created_at.asc`,
  );
}

export async function createWorkspaceCommentary(
  sub: string,
  workspaceId: string,
  passageId: string,
  input: { title?: string | null; body: string; note_type?: string },
): Promise<WorkspaceCommentaryNoteRow> {
  const rows = await fluxJson<WorkspaceCommentaryNoteRow[]>(
    sub,
    "/workspace_commentary_notes",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        workspace_id: workspaceId,
        passage_id: passageId,
        note_type: input.note_type ?? "personal",
        title: input.title ?? null,
        body: input.body,
      }),
    },
  );
  const row = rows[0];
  if (!row) throw new Error("Flux POST workspace_commentary_notes returned no row");
  return row;
}

export async function updateWorkspaceCommentary(
  sub: string,
  noteId: string,
  input: { title?: string | null; body?: string },
): Promise<WorkspaceCommentaryNoteRow> {
  const rows = await fluxJson<WorkspaceCommentaryNoteRow[]>(
    sub,
    `/workspace_commentary_notes?id=eq.${encodeURIComponent(noteId)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(input),
    },
  );
  const row = rows[0];
  if (!row) throw new Error("Flux PATCH workspace_commentary_notes returned no row");
  return row;
}

export async function listWorkspaceVariants(
  sub: string,
  workspaceId: string,
  passageId: string,
): Promise<WorkspaceTranslationVariantRow[]> {
  return fluxJson<WorkspaceTranslationVariantRow[]>(
    sub,
    `/workspace_translation_variants?workspace_id=eq.${encodeURIComponent(workspaceId)}&passage_id=eq.${encodeURIComponent(passageId)}&order=created_at.asc`,
  );
}
