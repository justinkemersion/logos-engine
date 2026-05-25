import { fluxJson } from "./client";
import type { CommentaryNoteRow, ConceptMentionRow } from "@/lib/types/entities";

export async function listCommentaryNotes(
  sub: string,
  passageId: string,
): Promise<CommentaryNoteRow[]> {
  return fluxJson<CommentaryNoteRow[]>(
    sub,
    `/commentary_notes?passage_id=eq.${encodeURIComponent(passageId)}&order=created_at.asc`,
  );
}

export async function listConceptMentions(
  sub: string,
  passageId: string,
): Promise<ConceptMentionRow[]> {
  return fluxJson<ConceptMentionRow[]>(
    sub,
    `/concept_mentions?passage_id=eq.${encodeURIComponent(passageId)}&order=created_at.asc`,
  );
}

export async function listFragments(sub: string): Promise<CommentaryNoteRow[]> {
  return fluxJson<CommentaryNoteRow[]>(
    sub,
    `/commentary_notes?note_type=eq.fragment&order=created_at.asc`,
  );
}

export async function getCommentaryNote(
  sub: string,
  id: string,
): Promise<CommentaryNoteRow | null> {
  const rows = await fluxJson<CommentaryNoteRow[]>(
    sub,
    `/commentary_notes?id=eq.${encodeURIComponent(id)}&limit=1`,
  );
  return rows[0] ?? null;
}

function titleFilter(title: string | null | undefined): string {
  if (title == null || title === "") {
    return "title=is.null";
  }
  return `title=eq.${encodeURIComponent(title)}`;
}

export async function findPromotedCommentaryNote(
  sub: string,
  passageId: string,
  sourceAiRunId: string,
  noteType: string,
  title: string | null | undefined,
): Promise<CommentaryNoteRow | null> {
  const rows = await fluxJson<CommentaryNoteRow[]>(
    sub,
    `/commentary_notes?passage_id=eq.${encodeURIComponent(passageId)}&source_ai_run_id=eq.${encodeURIComponent(sourceAiRunId)}&note_type=eq.${encodeURIComponent(noteType)}&${titleFilter(title)}&limit=1`,
  );
  return rows[0] ?? null;
}

export type CreateCommentaryNoteInput = {
  passage_id: string;
  note_type: string;
  title?: string | null;
  body: string;
  source_ai_run_id?: string | null;
  review_status?: string;
};

export async function createCommentaryNote(
  sub: string,
  input: CreateCommentaryNoteInput,
): Promise<CommentaryNoteRow> {
  const rows = await fluxJson<CommentaryNoteRow[]>(sub, "/commentary_notes", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      review_status: "draft",
      ...input,
    }),
  });
  const row = rows[0];
  if (!row) throw new Error("Flux POST /commentary_notes returned no row");
  return row;
}

export type UpdateCommentaryNoteInput = {
  note_type?: string;
  title?: string | null;
  body?: string;
  review_status?: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  reviewer_note?: string | null;
};

export async function updateCommentaryNote(
  sub: string,
  id: string,
  input: UpdateCommentaryNoteInput,
): Promise<CommentaryNoteRow> {
  const rows = await fluxJson<CommentaryNoteRow[]>(
    sub,
    `/commentary_notes?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(input),
    },
  );
  const row = rows[0];
  if (!row) throw new Error("Flux PATCH /commentary_notes returned no row");
  return row;
}
