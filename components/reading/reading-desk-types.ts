import type {
  AuthenticityProfileRow,
  CommentaryNoteRow,
  ConceptMentionRow,
  ConceptThreadRow,
  CrossReferenceRow,
  PassageRow,
  TokenRow,
  TranslationLayerRow,
  TranslationVariantRow,
  WorkRow,
  AiRunRow,
} from "@/lib/types/entities";

export type TranslationTab = "greek" | "literal" | "readable" | "commentary";
export type BottomTab = "grammar" | "notes" | "variants";

export type ReadingDeskProps = {
  work: WorkRow;
  passage: PassageRow;
  tokens: TokenRow[];
  translationLayers: TranslationLayerRow[];
  translationVariants: TranslationVariantRow[];
  commentaryNotes: CommentaryNoteRow[];
  conceptMentions: ConceptMentionRow[];
  conceptMap: Record<string, ConceptThreadRow>;
  authenticity: AuthenticityProfileRow | null;
  crossRefs: CrossReferenceRow[];
  passageMap: Record<string, PassageRow>;
  latestPassageDraftRun: AiRunRow | null;
};
