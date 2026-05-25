import { z } from "zod";

export type PassageInput = {
  workTitle: string;
  citation: string;
  greekText: string;
  author?: string;
};

export type TokenDraft = {
  surface: string;
  transliteration?: string;
  lemma?: string;
  morphology?: string;
  literalGloss?: string;
  note?: string;
};

export type TranslationLayerDraft = {
  layer: "literal" | "readable" | "philosophical";
  content: string;
  confidence: number;
};

export type TranslationVariantDraft = {
  sourcePhrase: string;
  variant: string;
  variantType: "literal" | "readable" | "poetic" | "philosophical";
  confidence: number;
  tradeoffNote: string;
};

export type ConceptDraft = {
  greekTerm: string;
  label: string;
  rationale: string;
};

export type CrossReferenceDraft = {
  relationshipType:
    | "echo"
    | "contrast"
    | "shared_concept"
    | "tone_parallel"
    | "mythic_parallel";
  targetWork?: string;
  targetCitation?: string;
  note: string;
  confidence: number;
};

export type CommentaryDraft = {
  noteType:
    | "lexical"
    | "grammatical"
    | "philosophical"
    | "translator_choice"
    | "transmission";
  title?: string;
  body: string;
};

export type AuthenticityDraft = {
  observation: string;
  confidence: number;
};

export type EditorialWarning = {
  level: "low" | "medium" | "high";
  message: string;
};

export type LogosPassageDraft = {
  tokens: TokenDraft[];
  translationLayers: TranslationLayerDraft[];
  variants: TranslationVariantDraft[];
  concepts: ConceptDraft[];
  crossReferences: CrossReferenceDraft[];
  commentary: CommentaryDraft[];
  authenticityNotes?: AuthenticityDraft[];
  editorialWarnings?: EditorialWarning[];
};

const confidenceSchema = z.number().min(0).max(1);

export const passageInputSchema = z.object({
  workTitle: z.string().min(1),
  citation: z.string().min(1),
  greekText: z.string().min(1),
  author: z.string().optional(),
});

export const tokenDraftSchema = z.object({
  surface: z.string().min(1),
  transliteration: z.string().optional(),
  lemma: z.string().optional(),
  morphology: z.string().optional(),
  literalGloss: z.string().optional(),
  note: z.string().optional(),
});

export const translationLayerDraftSchema = z.object({
  layer: z.enum(["literal", "readable", "philosophical"]),
  content: z.string().min(1),
  confidence: confidenceSchema,
});

export const translationVariantDraftSchema = z.object({
  sourcePhrase: z.string().min(1),
  variant: z.string().min(1),
  variantType: z.enum(["literal", "readable", "poetic", "philosophical"]),
  confidence: confidenceSchema,
  tradeoffNote: z.string().min(1),
});

export const conceptDraftSchema = z.object({
  greekTerm: z.string().min(1),
  label: z.string().min(1),
  rationale: z.string().min(1),
});

export const crossReferenceDraftSchema = z.object({
  relationshipType: z.enum([
    "echo",
    "contrast",
    "shared_concept",
    "tone_parallel",
    "mythic_parallel",
  ]),
  targetWork: z.string().optional(),
  targetCitation: z.string().optional(),
  note: z.string().min(1),
  confidence: confidenceSchema,
});

export const commentaryDraftSchema = z.object({
  noteType: z.enum([
    "lexical",
    "grammatical",
    "philosophical",
    "translator_choice",
    "transmission",
  ]),
  title: z.string().optional(),
  body: z.string().min(1),
});

export const authenticityDraftSchema = z.object({
  observation: z.string().min(1),
  confidence: confidenceSchema,
});

export const editorialWarningSchema = z.object({
  level: z.enum(["low", "medium", "high"]),
  message: z.string().min(1),
});

export const logosPassageDraftSchema = z.object({
  tokens: z.array(tokenDraftSchema).min(1),
  translationLayers: z.array(translationLayerDraftSchema),
  variants: z.array(translationVariantDraftSchema),
  concepts: z.array(conceptDraftSchema),
  crossReferences: z.array(crossReferenceDraftSchema),
  commentary: z.array(commentaryDraftSchema),
  authenticityNotes: z.array(authenticityDraftSchema).optional(),
  editorialWarnings: z.array(editorialWarningSchema).optional(),
});

export function parsePassageInput(raw: unknown): PassageInput {
  return passageInputSchema.parse(raw);
}

export function parseLogosPassageDraft(raw: unknown): LogosPassageDraft {
  return logosPassageDraftSchema.parse(raw);
}
