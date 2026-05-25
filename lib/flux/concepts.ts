import { fluxJson } from "./client";
import type { ConceptThreadRow, ConceptMentionRow } from "@/lib/types/entities";

export async function listConcepts(sub: string): Promise<ConceptThreadRow[]> {
  return fluxJson<ConceptThreadRow[]>(sub, "/concept_threads?order=label.asc");
}

export async function getConcept(
  sub: string,
  slug: string,
): Promise<ConceptThreadRow | null> {
  const rows = await fluxJson<ConceptThreadRow[]>(
    sub,
    `/concept_threads?slug=eq.${encodeURIComponent(slug)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function listMentionsByConcept(
  sub: string,
  conceptId: string,
): Promise<ConceptMentionRow[]> {
  return fluxJson<ConceptMentionRow[]>(
    sub,
    `/concept_mentions?concept_id=eq.${encodeURIComponent(conceptId)}&order=created_at.asc`,
  );
}

export type CreateConceptMentionInput = {
  concept_id: string;
  passage_id: string;
  token_id?: string | null;
  note?: string | null;
};

export async function createConceptMention(
  sub: string,
  input: CreateConceptMentionInput,
): Promise<ConceptMentionRow> {
  const rows = await fluxJson<ConceptMentionRow[]>(sub, "/concept_mentions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(input),
  });
  const row = rows[0];
  if (!row) throw new Error("Flux POST /concept_mentions returned no row");
  return row;
}
