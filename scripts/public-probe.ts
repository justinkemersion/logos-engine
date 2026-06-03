#!/usr/bin/env tsx
/**
 * Verifies anon public-read policies via fluxAnon() only.
 * Run after: flux push 0013 (and again after 0014).
 */
import { loadEnvFiles } from "./lib/load-env";
import { fluxAnon, FluxHttpError } from "../lib/flux/client";

loadEnvFiles();
import { ODYSSEY_1_1_PASSAGE_ID } from "../lib/public/passages";

type Check = { name: string; ok: boolean; detail: string };

const checks: Check[] = [];

function record(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail });
}

async function expectRows<T>(name: string, path: string, min = 1): Promise<void> {
  try {
    const rows = await fluxAnon<T[]>(path);
    const count = Array.isArray(rows) ? rows.length : 0;
    record(name, count >= min, count >= min ? `${count} row(s)` : "empty");
  } catch (e) {
    const msg = e instanceof FluxHttpError ? `${e.status}: ${e.message}` : String(e);
    record(name, false, msg);
  }
}

async function expectEmpty(name: string, path: string): Promise<void> {
  try {
    const rows = await fluxAnon<unknown[]>(path);
    const count = Array.isArray(rows) ? rows.length : 0;
    record(name, count === 0, count === 0 ? "empty" : `${count} row(s) leaked`);
  } catch (e) {
    if (e instanceof FluxHttpError && (e.status === 403 || e.status === 401)) {
      record(name, true, `blocked (${e.status})`);
      return;
    }
    const msg = e instanceof FluxHttpError ? `${e.status}: ${e.message}` : String(e);
    record(name, false, msg);
  }
}

async function main() {
  if (!process.env.FLUX_URL?.trim()) {
    console.error("FLUX_URL is not set");
    process.exit(1);
  }
  if (!process.env.FLUX_POSTGREST_SCHEMA?.trim() && !process.env.FLUX_POSTGREST_PROFILE?.trim()) {
    console.error("FLUX_POSTGREST_SCHEMA is not set — run pnpm flux:schema:sync");
    process.exit(1);
  }

  await expectRows("works readable", "/works?limit=1", 1);
  await expectRows(
    "Odyssey 1.1 passage",
    `/passages?id=eq.${ODYSSEY_1_1_PASSAGE_ID}&limit=1`,
    1,
  );
  await expectRows(
    "accepted translation_layers",
    `/translation_layers?passage_id=eq.${ODYSSEY_1_1_PASSAGE_ID}&status=eq.accepted&limit=1`,
    1,
  );
  await expectEmpty(
    "draft translation_layers blocked",
    `/translation_layers?passage_id=eq.${ODYSSEY_1_1_PASSAGE_ID}&status=eq.draft`,
  );
  await expectEmpty(
    "draft translation_variants blocked",
    `/translation_variants?passage_id=eq.${ODYSSEY_1_1_PASSAGE_ID}&review_status=eq.draft&limit=1`,
  );
  await expectEmpty(
    "draft commentary_notes blocked",
    `/commentary_notes?passage_id=eq.${ODYSSEY_1_1_PASSAGE_ID}&review_status=eq.draft&limit=1`,
  );
  await expectEmpty(
    "draft concept_mentions blocked",
    `/concept_mentions?passage_id=eq.${ODYSSEY_1_1_PASSAGE_ID}&review_status=eq.draft&limit=1`,
  );
  await expectEmpty("ai_runs blocked", "/ai_runs?limit=1");
  await expectEmpty("workspace_translation_layers blocked", "/workspace_translation_layers?limit=1");
  await expectEmpty("workspace_translation_variants blocked", "/workspace_translation_variants?limit=1");
  await expectEmpty("workspace_commentary_notes blocked", "/workspace_commentary_notes?limit=1");

  const failed = checks.filter((c) => !c.ok);
  for (const c of checks) {
    console.log(`${c.ok ? "OK" : "FAIL"}  ${c.name}: ${c.detail}`);
  }
  if (failed.length > 0) {
    console.error(`\n${failed.length} check(s) failed. Push 0013_public_read_* and verify gateway anon bridge.`);
    process.exit(1);
  }
  console.log("\nAll public probe checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
