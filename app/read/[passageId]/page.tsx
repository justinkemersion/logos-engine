import { notFound } from "next/navigation";
import { PublicReaderShell } from "@/components/public/PublicReaderShell";
import { PublicPassageReader } from "@/components/public/PublicPassageReader";
import {
  getPublicPassage,
  getPublicWorkById,
  listPublicPassagesByWork,
  listPublicTokensForPassage,
  listPublicTranslationLayers,
  listPublicVariants,
  listPublicCommentary,
  listPublicConceptMentions,
  listPublicConcepts,
  getPublicAuthenticity,
} from "@/lib/public/passages";
import type {
  WorkRow,
  TokenRow,
  TranslationLayerRow,
  TranslationVariantRow,
  CommentaryNoteRow,
  ConceptMentionRow,
  ConceptThreadRow,
  AuthenticityProfileRow,
  PassageRow,
} from "@/lib/types/entities";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function PublicPassagePage({
  params,
}: {
  params: Promise<{ passageId: string }>;
}) {
  const { passageId } = await params;
  const passage = await safe(() => getPublicPassage(passageId), null);
  if (!passage) notFound();

  const [
    work,
    siblings,
    tokens,
    translationLayers,
    translationVariants,
    commentaryNotes,
    conceptMentions,
    allConcepts,
    authenticity,
  ]: [
    WorkRow | null,
    PassageRow[],
    TokenRow[],
    TranslationLayerRow[],
    TranslationVariantRow[],
    CommentaryNoteRow[],
    ConceptMentionRow[],
    ConceptThreadRow[],
    AuthenticityProfileRow | null,
  ] = await Promise.all([
    safe(() => getPublicWorkById(passage.work_id), null),
    safe(() => listPublicPassagesByWork(passage.work_id), []),
    safe(() => listPublicTokensForPassage(passage.id), []),
    safe(() => listPublicTranslationLayers(passage.id), []),
    safe(() => listPublicVariants(passage.id), []),
    safe(() => listPublicCommentary(passage.id), []),
    safe(() => listPublicConceptMentions(passage.id), []),
    safe(() => listPublicConcepts(), []),
    safe(() => getPublicAuthenticity(passage.work_id), null),
  ]);

  const fallbackWork: WorkRow = {
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

  const conceptMap: Record<string, ConceptThreadRow> = {};
  for (const c of allConcepts) {
    conceptMap[c.id] = c;
  }
  const concepts = conceptMentions
    .map((m) => conceptMap[m.concept_id])
    .filter(Boolean) as ConceptThreadRow[];
  const uniqueConcepts = Array.from(new Map(concepts.map((c) => [c.id, c])).values());

  const resolvedWork = work ?? fallbackWork;
  const breadcrumb = (
    <span>
      {resolvedWork.author} › {resolvedWork.title} › {passage.citation_ref}
    </span>
  );

  return (
    <PublicReaderShell breadcrumb={breadcrumb}>
      <PublicPassageReader
        work={resolvedWork}
        passage={passage}
        siblings={siblings}
        tokens={tokens}
        translationLayers={translationLayers}
        translationVariants={translationVariants}
        commentaryNotes={commentaryNotes}
        concepts={uniqueConcepts}
        authenticity={authenticity}
      />
    </PublicReaderShell>
  );
}
