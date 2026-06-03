#!/usr/bin/env bash
# Pull latest main and rebuild Logos Engine on the production host.
# Usage (from repo root):
#   ./deploy/relaunch.sh
#   LOGOS_DEPLOY_HOST=root@178.104.205.138 ./deploy/relaunch.sh
set -euo pipefail

HOST="${LOGOS_DEPLOY_HOST:-root@178.104.205.138}"
APP_DIR="${LOGOS_DEPLOY_DIR:-/srv/apps/logos-engine}"
COMPOSE_ENV="${LOGOS_COMPOSE_ENV:-.env.docker}"

ssh "$HOST" "set -euo pipefail
  cd '$APP_DIR'
  if [ ! -d .git ]; then
    echo 'ERROR: $APP_DIR is not a git repository.'
    echo 'Run ./deploy/bootstrap-server.sh once (see _contract/deployment.md).'
    exit 1
  fi
  echo '=== git pull ==='
  git pull origin main
  echo '=== docker compose rebuild ==='
  docker compose --env-file '$COMPOSE_ENV' up --build -d
  echo '=== container status ==='
  docker compose --env-file '$COMPOSE_ENV' ps
  echo '=== health (after brief wait) ==='
  sleep 20
  docker inspect logos-engine-web --format 'Health: {{.State.Health.Status}} | Running: {{.State.Running}}' 2>/dev/null || true
  echo '=== recent runtime logs ==='
  docker compose --env-file '$COMPOSE_ENV' logs --tail=20 web 2>&1
"

echo "=== smoke test ==="
curl -sS -o /dev/null -w "https logos /read: %{http_code}\n" https://logos.vsl-base.com/read || true
