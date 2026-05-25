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
