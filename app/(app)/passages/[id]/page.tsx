import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPassage, listPassagesByWork } from "@/lib/flux/passages";
import { getWork, getAuthenticity } from "@/lib/flux/works";
import { listTokensForPassage } from "@/lib/flux/tokens";
import { listTranslationLayers, listTranslationVariants } from "@/lib/flux/translations";
import { listCommentaryNotes, listConceptMentions } from "@/lib/flux/commentary";
import { listConcepts } from "@/lib/flux/concepts";
import { listCrossReferences } from "@/lib/flux/cross-references";
import { ReadingDesk } from "@/components/reading/ReadingDesk";
import type {
  WorkRow,
  TokenRow,
  TranslationLayerRow,
  TranslationVariantRow,
  CommentaryNoteRow,
  ConceptMentionRow,
  ConceptThreadRow,
  AuthenticityProfileRow,
  CrossReferenceRow,
  PassageRow,
} from "@/lib/types/entities";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function PassagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const sub = session!.user!.id;

  const passage = await safe(() => getPassage(sub, id), null);
  if (!passage) notFound();

  const [
    work,
    tokens,
    translationLayers,
    translationVariants,
    commentaryNotes,
    conceptMentions,
    allConcepts,
    authenticity,
    crossRefs,
    workPassages,
  ]: [
    WorkRow | null,
    TokenRow[],
    TranslationLayerRow[],
    TranslationVariantRow[],
    CommentaryNoteRow[],
    ConceptMentionRow[],
    ConceptThreadRow[],
    AuthenticityProfileRow | null,
    CrossReferenceRow[],
    PassageRow[],
  ] = await Promise.all([
    safe(() => getWork(sub, passage.work_id), null),
    safe(() => listTokensForPassage(sub, passage.id), []),
    safe(() => listTranslationLayers(sub, passage.id), []),
    safe(() => listTranslationVariants(sub, passage.id), []),
    safe(() => listCommentaryNotes(sub, passage.id), []),
    safe(() => listConceptMentions(sub, passage.id), []),
    safe(() => listConcepts(sub), []),
    safe(() => getAuthenticity(sub, passage.work_id), null),
    safe(() => listCrossReferences(sub, passage.id), []),
    safe(() => listPassagesByWork(sub, passage.work_id), []),
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

  const passageMap: Record<string, PassageRow> = {};
  for (const p of workPassages) {
    passageMap[p.id] = p;
  }

  return (
    <ReadingDesk
      work={work ?? fallbackWork}
      passage={passage}
      tokens={tokens}
      translationLayers={translationLayers}
      translationVariants={translationVariants}
      commentaryNotes={commentaryNotes}
      conceptMentions={conceptMentions}
      conceptMap={conceptMap}
      authenticity={authenticity}
      crossRefs={crossRefs}
      passageMap={passageMap}
    />
  );
}
