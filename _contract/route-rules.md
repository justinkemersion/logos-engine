# Route rules

## Data loading

- **RSC pages** fetch data via `auth()` + `lib/flux/*` helpers
- **Server actions** for mutations (none in MVP — content is read-only)
- Return `{ ok: true, data? }` or `{ ok: false, error: string }` from actions

## Auth

- Public: `/`, `/login`, `/read`, `/read/**` — use `fluxAnon()` only (see `_contract/public-reader.md`)
- Protected workspace: `app/(workspace)/**` — layout calls `auth()` and redirects to `/login`
- Protected editorial: `app/(app)/**` — layout calls `auth()` and redirects to `/login`

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing page (public) |
| `/login` | Sign-in |
| `/read` | Public library |
| `/read/[...segments]` | Public passage reader (slug path) or UUID redirect |
| `/workspace` | Personal workspace dashboard |
| `/workspace/passages/[id]` | Workspace passage reader/editor |
| `/works` | Work library |
| `/works/[slug]` | Work overview + passage list |
| `/passages/[id]` | Reading desk |
| `/concepts` | Concept index |
| `/concepts/[slug]` | Concept detail with semantic trail |
| `/fragments` | Fragment cards |

## API routes

Only `app/api/auth/[...nextauth]/route.ts` for Auth.js. No ad-hoc REST in MVP.

## Size

Max 300 LOC per `page.tsx` / `route.ts`. Extract components when approaching limit.
