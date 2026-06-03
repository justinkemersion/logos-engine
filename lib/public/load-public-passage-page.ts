import {
  getPublicWorkById,
  listPublicPassagesByWork,
  listPublicTokensForPassage,
  listPublicTranslationLayers,
  listPublicVariants,
  listPublicCommentary,
  listPublicConceptMentions,
  listPublicConcepts,
  getPublicAuthenticity,
} from "./passages";
import type {
  AuthenticityProfileRow,
  CommentaryNoteRow,
  ConceptMentionRow,
  ConceptThreadRow,
  PassageRow,
  TokenRow,
  TranslationLayerRow,
  TranslationVariantRow,
  WorkRow,
} from "@/lib/types/entities";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export type PublicPassagePageData = {
  work: WorkRow;
  passage: PassageRow;
  siblings: PassageRow[];
  tokens: TokenRow[];
  translationLayers: TranslationLayerRow[];
  translationVariants: TranslationVariantRow[];
  commentaryNotes: CommentaryNoteRow[];
  concepts: ConceptThreadRow[];
  authenticity: AuthenticityProfileRow | null;
};

function fallbackWork(passage: PassageRow): WorkRow {
  return {
    id: passage.work_id,
    slug: "",
    title: "Unknown",
    original_title: null,
    author: "Unknown",
    tradition: null,
    language: "Ancient Greek",
    description: null,
    created_at: "",
    updated_at: "",
  };
}

export async function loadPublicPassagePage(
  passage: PassageRow,
  work: WorkRow | null,
): Promise<PublicPassagePageData> {
  const [
    resolvedWork,
    siblings,
    tokens,
    translationLayers,
    translationVariants,
    commentaryNotes,
    conceptMentions,
    allConcepts,
    authenticity,
  ] = await Promise.all([
    work ? Promise.resolve(work) : safe(() => getPublicWorkById(passage.work_id), null),
    safe(() => listPublicPassagesByWork(passage.work_id), []),
    safe(() => listPublicTokensForPassage(passage.id), []),
    safe(() => listPublicTranslationLayers(passage.id), []),
    safe(() => listPublicVariants(passage.id), []),
    safe(() => listPublicCommentary(passage.id), []),
    safe(() => listPublicConceptMentions(passage.id), []),
    safe(() => listPublicConcepts(), []),
    safe(() => getPublicAuthenticity(passage.work_id), null),
  ]);

  const conceptMap: Record<string, ConceptThreadRow> = {};
  for (const c of allConcepts) {
    conceptMap[c.id] = c;
  }
  const concepts = conceptMentions
    .map((m) => conceptMap[m.concept_id])
    .filter(Boolean) as ConceptThreadRow[];
  const uniqueConcepts = Array.from(new Map(concepts.map((c) => [c.id, c])).values());

  return {
    work: resolvedWork ?? fallbackWork(passage),
    passage,
    siblings,
    tokens,
    translationLayers,
    translationVariants,
    commentaryNotes,
    concepts: uniqueConcepts,
    authenticity,
  };
}
