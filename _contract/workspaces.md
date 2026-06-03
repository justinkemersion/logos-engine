# Personal workspace contract

## Mode

Logged-in users maintain a **private interpretive layer** over the shared Greek corpus.
Workspace content does not alter public canonical tables.

Route: `/workspace`, `/workspace/passages/[passageId]`.

## Not a corpus fork

Users do not clone `works` or `passages`. Overlay rows reference shared `passage_id` only.

## Tables

- `workspaces` — `owner_sub` lives here only
- `workspace_translation_layers`
- `workspace_translation_variants`
- `workspace_commentary_notes`

## RLS

Child tables enforce ownership via parent `workspaces`:

```sql
exists (
  select 1 from workspaces
  where workspaces.id = <child>.workspace_id
    and workspaces.owner_sub = jwt sub
)
```

No `anon` grants on workspace tables.

## Flux

- Reads/writes: `fluxJson(sub, ...)` with real `session.user.id`
- Never POST/PATCH canonical `translation_layers` from workspace actions
- User AI generation is out of scope (future `workspace_ai_runs`)

## Default workspace

On first visit: `ensureDefaultWorkspace(sub)` creates slug `default`, name `My Logos Workspace`.
