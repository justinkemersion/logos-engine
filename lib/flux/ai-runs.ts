import { fluxJson } from "./client";
import type { AiRunRow } from "@/lib/types/entities";

export type CreateAiRunInput = {
  passage_id: string;
  run_type: string;
  model?: string | null;
  prompt?: string | null;
  output?: string | null;
  status?: string;
};

export async function listAiRunsForPassage(
  sub: string,
  passageId: string,
): Promise<AiRunRow[]> {
  return fluxJson<AiRunRow[]>(
    sub,
    `/ai_runs?passage_id=eq.${encodeURIComponent(passageId)}&order=created_at.desc`,
  );
}

export async function getAiRun(sub: string, id: string): Promise<AiRunRow | null> {
  const rows = await fluxJson<AiRunRow[]>(
    sub,
    `/ai_runs?id=eq.${encodeURIComponent(id)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function getLatestAiRunForPassage(
  sub: string,
  passageId: string,
  runType: string,
): Promise<AiRunRow | null> {
  const rows = await fluxJson<AiRunRow[]>(
    sub,
    `/ai_runs?passage_id=eq.${encodeURIComponent(passageId)}&run_type=eq.${encodeURIComponent(runType)}&order=created_at.desc&limit=1`,
  );
  return rows[0] ?? null;
}

export async function createAiRun(
  sub: string,
  input: CreateAiRunInput,
): Promise<AiRunRow> {
  const rows = await fluxJson<AiRunRow[]>(sub, "/ai_runs", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      status: "draft",
      ...input,
    }),
  });
  const row = rows[0];
  if (!row) {
    throw new Error("Flux POST /ai_runs returned no row");
  }
  return row;
}

export async function updateAiRunStatus(
  sub: string,
  id: string,
  status: string,
): Promise<AiRunRow> {
  const rows = await fluxJson<AiRunRow[]>(
    sub,
    `/ai_runs?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status }),
    },
  );
  const row = rows[0];
  if (!row) throw new Error("Flux PATCH /ai_runs returned no row");
  return row;
}
