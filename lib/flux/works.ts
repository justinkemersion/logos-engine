import { fluxJson } from "./client";
import type { WorkRow, AuthenticityProfileRow } from "@/lib/types/entities";

export async function listWorks(sub: string): Promise<WorkRow[]> {
  return fluxJson<WorkRow[]>(sub, "/works?order=author.asc,title.asc");
}

export async function getWork(sub: string, slug: string): Promise<WorkRow | null> {
  const rows = await fluxJson<WorkRow[]>(sub, `/works?slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] ?? null;
}

export async function getWorkById(sub: string, id: string): Promise<WorkRow | null> {
  const rows = await fluxJson<WorkRow[]>(sub, `/works?id=eq.${encodeURIComponent(id)}&limit=1`);
  return rows[0] ?? null;
}

export async function getAuthenticity(
  sub: string,
  workId: string,
): Promise<AuthenticityProfileRow | null> {
  const rows = await fluxJson<AuthenticityProfileRow[]>(
    sub,
    `/authenticity_profiles?work_id=eq.${encodeURIComponent(workId)}&limit=1`,
  );
  return rows[0] ?? null;
}
