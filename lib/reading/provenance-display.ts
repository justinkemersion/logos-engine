export function provenanceSummary(row: { source_ai_run_id?: string | null }): string | null {
  if (!row.source_ai_run_id) return null;
  return "Promoted from AI draft";
}
