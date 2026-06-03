import { fluxAnon } from "@/lib/flux/client";
import type { PassageRow, SectionRow, WorkRow } from "@/lib/types/entities";
import type {
  AuthenticityProfileRow,
  CommentaryNoteRow,
  ConceptMentionRow,
  ConceptThreadRow,
  CrossReferenceRow,
  TokenRow,
  TranslationLayerRow,
  TranslationVariantRow,
} from "@/lib/types/entities";

export const ODYSSEY_1_1_PASSAGE_ID = "00000000-0000-0000-0002-000000000001";

export async function listPublicWorks(): Promise<WorkRow[]> {
  return fluxAnon<WorkRow[]>("/works?order=author.asc,title.asc");
}

export async function getPublicWork(slug: string): Promise<WorkRow | null> {
  const rows = await fluxAnon<WorkRow[]>(
    `/works?slug=eq.${encodeURIComponent(slug)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function getPublicWorkById(id: string): Promise<WorkRow | null> {
  const rows = await fluxAnon<WorkRow[]>(`/works?id=eq.${encodeURIComponent(id)}&limit=1`);
  return rows[0] ?? null;
}

export async function listPublicPassagesByWork(workId: string): Promise<PassageRow[]> {
  return fluxAnon<PassageRow[]>(
    `/passages?work_id=eq.${encodeURIComponent(workId)}&order=sequence.asc`,
  );
}

export async function getPublicPassage(id: string): Promise<PassageRow | null> {
  const rows = await fluxAnon<PassageRow[]>(
    `/passages?id=eq.${encodeURIComponent(id)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function listPublicSectionsByWork(workId: string): Promise<SectionRow[]> {
  return fluxAnon<SectionRow[]>(
    `/sections?work_id=eq.${encodeURIComponent(workId)}&order=sequence.asc`,
  );
}

export async function listPublicTokensForPassage(passageId: string): Promise<TokenRow[]> {
  return fluxAnon<TokenRow[]>(
    `/tokens?passage_id=eq.${encodeURIComponent(passageId)}&order=token_index.asc`,
  );
}

export async function listPublicTranslationLayers(
  passageId: string,
): Promise<TranslationLayerRow[]> {
  return fluxAnon<TranslationLayerRow[]>(
    `/translation_layers?passage_id=eq.${encodeURIComponent(passageId)}&status=eq.accepted&order=created_at.asc`,
  );
}

export async function listPublicVariants(passageId: string): Promise<TranslationVariantRow[]> {
  return fluxAnon<TranslationVariantRow[]>(
    `/translation_variants?passage_id=eq.${encodeURIComponent(passageId)}&review_status=eq.reviewed&order=created_at.asc`,
  );
}

export async function listPublicCommentary(passageId: string): Promise<CommentaryNoteRow[]> {
  return fluxAnon<CommentaryNoteRow[]>(
    `/commentary_notes?passage_id=eq.${encodeURIComponent(passageId)}&review_status=eq.reviewed&order=created_at.asc`,
  );
}

export async function listPublicConceptMentions(
  passageId: string,
): Promise<ConceptMentionRow[]> {
  return fluxAnon<ConceptMentionRow[]>(
    `/concept_mentions?passage_id=eq.${encodeURIComponent(passageId)}&review_status=eq.reviewed&order=created_at.asc`,
  );
}

export async function listPublicConcepts(): Promise<ConceptThreadRow[]> {
  return fluxAnon<ConceptThreadRow[]>("/concept_threads?order=label.asc");
}

export async function getPublicAuthenticity(
  workId: string,
): Promise<AuthenticityProfileRow | null> {
  const rows = await fluxAnon<AuthenticityProfileRow[]>(
    `/authenticity_profiles?work_id=eq.${encodeURIComponent(workId)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function listPublicCrossReferences(
  passageId: string,
): Promise<CrossReferenceRow[]> {
  const [asSource, asTarget] = await Promise.all([
    fluxAnon<CrossReferenceRow[]>(
      `/cross_references?source_passage_id=eq.${encodeURIComponent(passageId)}&order=created_at.asc`,
    ),
    fluxAnon<CrossReferenceRow[]>(
      `/cross_references?target_passage_id=eq.${encodeURIComponent(passageId)}&order=created_at.asc`,
    ),
  ]);
  return [...asSource, ...asTarget];
}
