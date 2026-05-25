import { fluxJson } from "./client";
import type { TranslationLayerRow, TranslationVariantRow } from "@/lib/types/entities";

export async function listTranslationLayers(
  sub: string,
  passageId: string,
): Promise<TranslationLayerRow[]> {
  return fluxJson<TranslationLayerRow[]>(
    sub,
    `/translation_layers?passage_id=eq.${encodeURIComponent(passageId)}&order=created_at.asc`,
  );
}

export async function listTranslationVariants(
  sub: string,
  passageId: string,
): Promise<TranslationVariantRow[]> {
  return fluxJson<TranslationVariantRow[]>(
    sub,
    `/translation_variants?passage_id=eq.${encodeURIComponent(passageId)}&order=created_at.asc`,
  );
}

export async function getTranslationLayer(
  sub: string,
  id: string,
): Promise<TranslationLayerRow | null> {
  const rows = await fluxJson<TranslationLayerRow[]>(
    sub,
    `/translation_layers?id=eq.${encodeURIComponent(id)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function findPromotedTranslationLayer(
  sub: string,
  passageId: string,
  layer: string,
  sourceAiRunId: string,
): Promise<TranslationLayerRow | null> {
  const rows = await fluxJson<TranslationLayerRow[]>(
    sub,
    `/translation_layers?passage_id=eq.${encodeURIComponent(passageId)}&layer=eq.${encodeURIComponent(layer)}&source_ai_run_id=eq.${encodeURIComponent(sourceAiRunId)}&limit=1`,
  );
  return rows[0] ?? null;
}

export type CreateTranslationLayerInput = {
  passage_id: string;
  layer: string;
  content: string;
  status?: string;
  reviewer_note?: string | null;
  source_ai_run_id?: string | null;
};

export async function createTranslationLayer(
  sub: string,
  input: CreateTranslationLayerInput,
): Promise<TranslationLayerRow> {
  const rows = await fluxJson<TranslationLayerRow[]>(sub, "/translation_layers", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      status: "draft",
      ...input,
    }),
  });
  const row = rows[0];
  if (!row) throw new Error("Flux POST /translation_layers returned no row");
  return row;
}

export type UpdateTranslationLayerInput = {
  content?: string;
  status?: string;
  reviewer_note?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
};

export async function updateTranslationLayer(
  sub: string,
  id: string,
  input: UpdateTranslationLayerInput,
): Promise<TranslationLayerRow> {
  const rows = await fluxJson<TranslationLayerRow[]>(
    sub,
    `/translation_layers?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(input),
    },
  );
  const row = rows[0];
  if (!row) throw new Error("Flux PATCH /translation_layers returned no row");
  return row;
}

export async function getTranslationVariant(
  sub: string,
  id: string,
): Promise<TranslationVariantRow | null> {
  const rows = await fluxJson<TranslationVariantRow[]>(
    sub,
    `/translation_variants?id=eq.${encodeURIComponent(id)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function findPromotedTranslationVariant(
  sub: string,
  passageId: string,
  sourceAiRunId: string,
  phrase: string,
  variant: string,
): Promise<TranslationVariantRow | null> {
  const rows = await fluxJson<TranslationVariantRow[]>(
    sub,
    `/translation_variants?passage_id=eq.${encodeURIComponent(passageId)}&source_ai_run_id=eq.${encodeURIComponent(sourceAiRunId)}&phrase=eq.${encodeURIComponent(phrase)}&variant=eq.${encodeURIComponent(variant)}&limit=1`,
  );
  return rows[0] ?? null;
}

export type CreateTranslationVariantInput = {
  passage_id: string;
  token_id?: string | null;
  phrase: string;
  variant: string;
  variant_type: string;
  rationale?: string | null;
  confidence?: string | null;
  tradeoff_note?: string | null;
  source_ai_run_id?: string | null;
  review_status?: string;
};

export async function createTranslationVariant(
  sub: string,
  input: CreateTranslationVariantInput,
): Promise<TranslationVariantRow> {
  const rows = await fluxJson<TranslationVariantRow[]>(sub, "/translation_variants", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      review_status: "draft",
      ...input,
    }),
  });
  const row = rows[0];
  if (!row) throw new Error("Flux POST /translation_variants returned no row");
  return row;
}

export type UpdateTranslationVariantInput = {
  token_id?: string | null;
  phrase?: string;
  variant?: string;
  variant_type?: string;
  rationale?: string | null;
  confidence?: string | null;
  tradeoff_note?: string | null;
  review_status?: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  reviewer_note?: string | null;
};

export async function updateTranslationVariant(
  sub: string,
  id: string,
  input: UpdateTranslationVariantInput,
): Promise<TranslationVariantRow> {
  const rows = await fluxJson<TranslationVariantRow[]>(
    sub,
    `/translation_variants?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(input),
    },
  );
  const row = rows[0];
  if (!row) throw new Error("Flux PATCH /translation_variants returned no row");
  return row;
}
