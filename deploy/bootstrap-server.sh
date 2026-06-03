#!/usr/bin/env bash
# First-time (or re-) bootstrap: git clone at /srv/apps/logos-engine on the production host.
# Preserves an existing .env.docker when replacing a non-git tree (e.g. rsync artifact).
#
# Usage (from repo root, after git push origin main):
#   ./deploy/bootstrap-server.sh
#   LOGOS_DEPLOY_HOST=root@178.104.205.138 ./deploy/bootstrap-server.sh
set -euo pipefail

HOST="${LOGOS_DEPLOY_HOST:-root@178.104.205.138}"
APP_DIR="${LOGOS_DEPLOY_DIR:-/srv/apps/logos-engine}"
REPO="${LOGOS_GIT_REPO:-git@github.com:justinkemersion/logos-engine.git}"
BRANCH="${LOGOS_DEPLOY_BRANCH:-main}"
COMPOSE_ENV="${LOGOS_COMPOSE_ENV:-.env.docker}"

ssh "$HOST" "set -euo pipefail
  if [ -d '$APP_DIR/.git' ]; then
    echo 'ERROR: $APP_DIR is already a git clone.'
    echo 'Use ./deploy/relaunch.sh for routine deploys.'
    exit 1
  fi

  ENV_BACKUP=''
  if [ -f '$APP_DIR/$COMPOSE_ENV' ]; then
    ENV_BACKUP=\$(mktemp)
    cp '$APP_DIR/$COMPOSE_ENV' \"\$ENV_BACKUP\"
    echo '=== preserved existing $COMPOSE_ENV ==='
  fi

  if [ -d '$APP_DIR' ]; then
    echo '=== removing non-git tree at $APP_DIR ==='
    rm -rf '$APP_DIR'
  fi

  mkdir -p /srv/apps
  echo '=== git clone ==='
  git clone '$REPO' '$APP_DIR'
  cd '$APP_DIR'
  git checkout '$BRANCH'

  if [ -n \"\$ENV_BACKUP\" ] && [ -f \"\$ENV_BACKUP\" ]; then
    cp \"\$ENV_BACKUP\" '$COMPOSE_ENV'
    rm \"\$ENV_BACKUP\"
  elif [ ! -f '$COMPOSE_ENV' ]; then
    cp deploy/env.docker.example '$COMPOSE_ENV'
    echo '=== created $COMPOSE_ENV from example — edit secrets, then re-run compose ==='
    exit 0
  fi

  echo '=== docker compose up --build -d ==='
  docker compose --env-file '$COMPOSE_ENV' up --build -d
  docker compose --env-file '$COMPOSE_ENV' ps
"

echo "=== smoke test ==="
curl -sS -o /dev/null -w "https logos /read: %{http_code}\n" https://logos.vsl-base.com/read || true
