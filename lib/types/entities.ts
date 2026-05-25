export type SourceEditionRow = {
  id: string;
  slug: string;
  label: string;
  tradition: string | null;
  url: string | null;
  note: string | null;
  created_at: string;
};

export type WorkRow = {
  id: string;
  slug: string;
  title: string;
  original_title: string | null;
  author: string;
  tradition: string | null;
  language: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type SectionRow = {
  id: string;
  work_id: string;
  slug: string;
  title: string;
  sequence: number;
  citation_label: string | null;
  created_at: string;
};

export type PassageRow = {
  id: string;
  work_id: string;
  section_id: string | null;
  source_edition_id: string | null;
  citation_ref: string;
  sequence: number;
  greek_text: string;
  normalized_greek: string | null;
  source_note: string | null;
  created_at: string;
  updated_at: string;
};

export type TokenRow = {
  id: string;
  passage_id: string;
  token_index: number;
  surface: string;
  lemma: string | null;
  transliteration: string | null;
  morphology: string | null;
  literal_gloss: string | null;
  note: string | null;
  created_at: string;
};

export type TranslationLayerRow = {
  id: string;
  passage_id: string;
  layer: string;
  content: string;
  status: string;
  reviewer_note: string | null;
  created_at: string;
  updated_at: string;
};

export type TranslationVariantRow = {
  id: string;
  passage_id: string;
  token_id: string | null;
  phrase: string;
  variant: string;
  variant_type: string;
  rationale: string | null;
  confidence: string | null;
  tradeoff_note: string | null;
  created_at: string;
};

export type CommentaryNoteRow = {
  id: string;
  passage_id: string | null;
  note_type: string;
  title: string | null;
  body: string;
  created_at: string;
};

export type ConceptThreadRow = {
  id: string;
  slug: string;
  label: string;
  greek_term: string | null;
  description: string | null;
  created_at: string;
};

export type ConceptMentionRow = {
  id: string;
  concept_id: string;
  passage_id: string | null;
  token_id: string | null;
  note: string | null;
  created_at: string;
};

export type AuthenticityProfileRow = {
  id: string;
  work_id: string;
  status: string;
  confidence_label: string;
  summary: string;
  signals: Record<string, boolean | null>;
  created_at: string;
  updated_at: string;
};

export type AiRunRow = {
  id: string;
  passage_id: string | null;
  run_type: string;
  model: string | null;
  prompt: string | null;
  output: string | null;
  status: string;
  created_at: string;
};

export type CrossReferenceRow = {
  id: string;
  source_passage_id: string;
  target_passage_id: string;
  relationship_type: string;
  note: string | null;
  created_at: string;
};
