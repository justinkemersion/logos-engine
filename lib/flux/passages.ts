import { fluxJson } from "./client";
import type { PassageRow, SectionRow } from "@/lib/types/entities";

export async function listPassagesByWork(
  sub: string,
  workId: string,
): Promise<PassageRow[]> {
  return fluxJson<PassageRow[]>(
    sub,
    `/passages?work_id=eq.${encodeURIComponent(workId)}&order=sequence.asc`,
  );
}

export async function getPassage(sub: string, id: string): Promise<PassageRow | null> {
  const rows = await fluxJson<PassageRow[]>(
    sub,
    `/passages?id=eq.${encodeURIComponent(id)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function listSectionsByWork(
  sub: string,
  workId: string,
): Promise<SectionRow[]> {
  return fluxJson<SectionRow[]>(
    sub,
    `/sections?work_id=eq.${encodeURIComponent(workId)}&order=sequence.asc`,
  );
}
