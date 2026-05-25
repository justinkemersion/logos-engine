import { fluxJson } from "./client";
import type { CrossReferenceRow } from "@/lib/types/entities";

export async function listCrossReferences(
  sub: string,
  passageId: string,
): Promise<CrossReferenceRow[]> {
  const [asSource, asTarget] = await Promise.all([
    fluxJson<CrossReferenceRow[]>(
      sub,
      `/cross_references?source_passage_id=eq.${encodeURIComponent(passageId)}&order=created_at.asc`,
    ),
    fluxJson<CrossReferenceRow[]>(
      sub,
      `/cross_references?target_passage_id=eq.${encodeURIComponent(passageId)}&order=created_at.asc`,
    ),
  ]);
  return [...asSource, ...asTarget];
}
