import type { TranslationLayerRow } from "@/lib/types/entities";

/** Accepted canonical layers only (defense-in-depth; RLS also filters). */
export function isPublicLayer(row: TranslationLayerRow): boolean {
  return row.status === "accepted";
}

export function filterPublicLayers(layers: TranslationLayerRow[]): TranslationLayerRow[] {
  return layers.filter(isPublicLayer);
}

export function pickPublicLayer(
  layers: TranslationLayerRow[],
  layerName: string,
): TranslationLayerRow | undefined {
  return filterPublicLayers(layers).find((l) => l.layer === layerName);
}
