-- 0018_machinery_rls_reenable.sql
--
-- Re-enable and FORCE row level security on ai_runs, translation_layers and
-- translation_variants.
--
-- Prod catalog (2026-10-08 scan): these three tables have relrowsecurity = f and
-- relforcerowsecurity = f, but all of their policies from 0003/0005/0009/0010/0011/
-- 0013/0015/0016/0017 are still present (4, 5, 5 policies). Every other table in
-- t_744b22df8382_api has RLS + FORCE on.
--
-- Why the old policies cannot simply be switched back on:
--   1. 0016/0017 read current_setting('request.jwt.claim.sub'). The Flux pool runs
--      PostgREST v12, which only sets request.jwt.claims (JSON). The per-claim GUC
--      is NULL, so the 0017 editor SELECT policy is false for every request, and
--      POST/PATCH with Prefer: return=representation would fail the RETURNING check.
--   2. On v2_shared the gateway bridges editor AND public-reader JWTs to
--      t_744b22df8382_role, which 0013 made a member of anon. The RESTRICTIVE
--      "to anon" policies from 0015 therefore also bind editors and hide drafts.
--   3. The 0013 permissive anon SELECT policies stay. A restrictive gate of
--      "status = 'accepted' OR editor" would still return accepted rows when
--      request.jwt.claims is missing or empty, because that anon policy matches
--      and the tenant role is a member of anon. Accepted/reviewed rows are
--      visible only for sub = 'public-reader'. An editor subject sees every row.
--      A missing or empty subject sees nothing.
--
-- This migration reads the subject from request.jwt.claims (the same source the
-- 0014 workspace policies use), keeps the public reader (sub = 'public-reader')
-- limited to accepted/reviewed rows and out of ai_runs, limits writes to editor
-- subjects, then enables and forces RLS. It does not touch grants.
--
-- "Editor" below = a JWT sub that is non-empty and not 'public-reader'.

-- ---------------------------------------------------------------------------
-- ai_runs
-- ---------------------------------------------------------------------------
drop policy if exists ai_runs_select on ai_runs;
create policy ai_runs_select on ai_runs
  for select to authenticated
  using (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
  );

drop policy if exists ai_runs_insert on ai_runs;
create policy ai_runs_insert on ai_runs
  for insert to authenticated
  with check (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
  );

drop policy if exists ai_runs_update on ai_runs;
create policy ai_runs_update on ai_runs
  for update to authenticated
  using (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
  )
  with check (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
  );

-- ai_runs_anon_deny (0016, for select to anon using (false)) is kept as is.

-- ---------------------------------------------------------------------------
-- translation_layers
-- ---------------------------------------------------------------------------
drop policy if exists translation_layers_select on translation_layers;
create policy translation_layers_select on translation_layers
  for select to authenticated
  using (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
  );

-- Restrictive anon policy. Still binds the tenant role (member of anon).
-- Editors pass every row. The public reader passes accepted rows only.
-- A missing or empty subject passes nothing, so translation_layers_select_anon
-- cannot leak accepted rows onto a pooled session with no JWT.
drop policy if exists translation_layers_anon_restrict on translation_layers;
create policy translation_layers_anon_restrict on translation_layers
  as restrictive for select to anon
  using (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
    or (
      status = 'accepted'
      and coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
        = 'public-reader'
    )
  );

drop policy if exists translation_layers_insert on translation_layers;
create policy translation_layers_insert on translation_layers
  for insert to authenticated
  with check (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
  );

drop policy if exists translation_layers_update on translation_layers;
create policy translation_layers_update on translation_layers
  for update to authenticated
  using (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
  )
  with check (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
  );

-- Public reader through the tenant runtime role. Does not depend on
-- t_744b22df8382_role being a member of anon (0013), which pooled push may not
-- have been able to grant. Accepted rows only.
drop policy if exists translation_layers_select_public_reader on translation_layers;
create policy translation_layers_select_public_reader on translation_layers
  for select to authenticated
  using (
    status = 'accepted'
    and coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '') = 'public-reader'
  );

-- translation_layers_select_anon (0013, to anon using (status = 'accepted')) is kept.

-- ---------------------------------------------------------------------------
-- translation_variants
-- ---------------------------------------------------------------------------
drop policy if exists translation_variants_select on translation_variants;
create policy translation_variants_select on translation_variants
  for select to authenticated
  using (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
  );

drop policy if exists translation_variants_anon_restrict on translation_variants;
create policy translation_variants_anon_restrict on translation_variants
  as restrictive for select to anon
  using (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
    or (
      review_status = 'reviewed'
      and coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
        = 'public-reader'
    )
  );

drop policy if exists translation_variants_insert on translation_variants;
create policy translation_variants_insert on translation_variants
  for insert to authenticated
  with check (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
  );

drop policy if exists translation_variants_update on translation_variants;
create policy translation_variants_update on translation_variants
  for update to authenticated
  using (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
  )
  with check (
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '')
      not in ('', 'public-reader')
  );

drop policy if exists translation_variants_select_public_reader on translation_variants;
create policy translation_variants_select_public_reader on translation_variants
  for select to authenticated
  using (
    review_status = 'reviewed'
    and coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'sub', '') = 'public-reader'
  );

-- translation_variants_select_anon (0013, to anon using (review_status = 'reviewed')) is kept.

-- ---------------------------------------------------------------------------
-- Turn RLS back on, and force it (owner t_744b22df8382_ddl is subject too).
-- No SECURITY DEFINER functions exist in this schema (2026-10-08 scan), so FORCE
-- cannot blind a helper.
-- ---------------------------------------------------------------------------
alter table ai_runs              enable row level security;
alter table ai_runs              force  row level security;
alter table translation_layers   enable row level security;
alter table translation_layers   force  row level security;
alter table translation_variants enable row level security;
alter table translation_variants force  row level security;
