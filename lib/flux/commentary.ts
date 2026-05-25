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

export type CreateCommentaryNoteInput = {
  passage_id: string;
  note_type: string;
  title?: string | null;
  body: string;
};

export async function createCommentaryNote(
  sub: string,
  input: CreateCommentaryNoteInput,
): Promise<CommentaryNoteRow> {
  const rows = await fluxJson<CommentaryNoteRow[]>(sub, "/commentary_notes", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(input),
  });
  const row = rows[0];
  if (!row) throw new Error("Flux POST /commentary_notes returned no row");
  return row;
}
