# Production deployment contract

Authoritative operator runbook for **Logos Engine** on the Hetzner host. Same Foundry pattern
as Ledger and Bloom Atelier: **Git is the source of truth**; the server never receives laptop
rsync copies.

## Constants

| Constant | Value |
|----------|--------|
| Host | `root@178.104.205.138` |
| App path | `/srv/apps/logos-engine` |
| Public URL | `https://logos.vsl-base.com` |
| Git remote | `git@github.com:justinkemersion/logos-engine.git` |
| Branch | `main` |
| Docker network | `flux-network` (external) |
| Production env file | `.env.docker` (server only, gitignored) |

## Source of truth

1. **All application code** reaches production via `git pull origin main` on the server.
2. **Never** rsync or scp the repo tree for routine deploys. Rsync is not reproducible and
   can deploy uncommitted or wrong-branch code.
3. **Secrets** live only in `/srv/apps/logos-engine/.env.docker` on the server. Never commit
   `.env.docker`. Template: `deploy/env.docker.example`.
4. **SQL migrations** are pushed from the operator machine with `flux push` (see
   `_contract/flux-workflow.md`), not from the app container.

## Environment (production)

Copy `deploy/env.docker.example` → `.env.docker` on first bootstrap. Required at launch:

| Variable | Notes |
|----------|--------|
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | Production OAuth app |
| `AUTH_GITHUB_SECRET` | Server only |
| `AUTH_URL` / `NEXTAUTH_URL` | `https://logos.vsl-base.com` |
| `FLUX_URL` | From `flux.json` / `flux list` |
| `FLUX_GATEWAY_JWT_SECRET` | `flux project credentials` |
| `FLUX_POSTGREST_SCHEMA` | e.g. `t_744b22df8382_api` |

**Omit at alpha launch:** `AUTH_GOOGLE_*`, `CURSOR_API_KEY`, `LOGOS_PASSAGE_DRAFT_UI_ENABLED`.

Route mode and SEO policy: `_contract/product.md` (public / workspace / editorial).

## First-time server bootstrap

On the server, the app directory **must** be a git clone. If a non-git tree exists (e.g. from
an rsync bootstrap), run `deploy/bootstrap-server.sh` from the repo root on your laptop. It
preserves an existing `.env.docker`, removes the orphan tree, clones, and builds.

```bash
./deploy/bootstrap-server.sh
```

Manual equivalent on the server:

```bash
mkdir -p /srv/apps
git clone git@github.com:justinkemersion/logos-engine.git /srv/apps/logos-engine
cd /srv/apps/logos-engine
cp deploy/env.docker.example .env.docker
# edit .env.docker
docker compose --env-file .env.docker up --build -d
```

## Routine deploy

After `git push origin main`:

```bash
./deploy/relaunch.sh
```

Or on the server:

```bash
cd /srv/apps/logos-engine
git pull origin main
docker compose --env-file .env.docker up --build -d
```

## Pre-deploy gates (operator machine)

Before merging deploy-related changes:

```bash
pnpm foundry:verify   # or at minimum: pnpm build && pnpm public:probe
pnpm flux:doctor
pnpm public:probe
```

`public:probe` must pass against the hosted `FLUX_URL` — anon must not read machinery tables
(`ai_runs`, draft canonical rows, `workspace_*`). See `_contract/public-reader.md`.

## Post-deploy verification

| Check | Expected |
|-------|----------|
| `curl -sS -o /dev/null -w '%{http_code}' https://logos.vsl-base.com/read` | `200` |
| Public passage canonical URL | Present in HTML |
| `/passages/**` unauthenticated | Redirect to `/login` |
| `pnpm public:probe` (production `FLUX_URL`) | All checks pass |
| Container health | `docker inspect logos-engine-web` → healthy |

Portal registration (Vessel manifest) is a separate repo (`vessel-web`); deploy that via
[`vessel-web` `_contract/deployment.md`](https://github.com/justinkemersion/vessel-web/blob/main/_contract/deployment.md)
after Logos soak passes.

## Logging policy

`NODE_ENV=production` in the Docker runner. Production logs must never emit AI prompt payloads,
JWT secrets, or workspace-private content.

## Forbidden

- Rsync/scp of the application tree for routine releases
- Committing `.env.docker` or production secrets
- Google OAuth or `CURSOR_API_KEY` in production until post-alpha review
- Skipping `public:probe` after public-read migration changes
