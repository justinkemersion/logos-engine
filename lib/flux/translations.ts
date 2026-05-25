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

export type CreateTranslationLayerInput = {
  passage_id: string;
  layer: string;
  content: string;
  status?: string;
  reviewer_note?: string | null;
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

export type CreateTranslationVariantInput = {
  passage_id: string;
  token_id?: string | null;
  phrase: string;
  variant: string;
  variant_type: string;
  rationale?: string | null;
  confidence?: string | null;
  tradeoff_note?: string | null;
};

export async function createTranslationVariant(
  sub: string,
  input: CreateTranslationVariantInput,
): Promise<TranslationVariantRow> {
  const rows = await fluxJson<TranslationVariantRow[]>(sub, "/translation_variants", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(input),
  });
  const row = rows[0];
  if (!row) throw new Error("Flux POST /translation_variants returned no row");
  return row;
}
