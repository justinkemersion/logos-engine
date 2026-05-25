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
