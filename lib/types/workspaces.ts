export type WorkspaceRow = {
  id: string;
  owner_sub: string;
  slug: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type WorkspaceTranslationLayerRow = {
  id: string;
  workspace_id: string;
  passage_id: string;
  layer: string;
  content: string;
  status: string;
  reviewer_note: string | null;
  created_at: string;
  updated_at: string;
};

export type WorkspaceTranslationVariantRow = {
  id: string;
  workspace_id: string;
  passage_id: string;
  source_phrase: string;
  variant: string;
  variant_type: string;
  confidence: string | null;
  tradeoff_note: string | null;
  created_at: string;
  updated_at: string;
};

export type WorkspaceCommentaryNoteRow = {
  id: string;
  workspace_id: string;
  passage_id: string;
  note_type: string;
  title: string | null;
  body: string;
  created_at: string;
  updated_at: string;
};
