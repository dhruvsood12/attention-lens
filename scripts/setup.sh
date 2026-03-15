#!/usr/bin/env bash
# AttentionLens — one-time setup (venv, deps, .env)
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Setting up AttentionLens at $ROOT"

# Backend venv and deps
if ! [ -d backend/.venv ]; then
  python3 -m venv backend/.venv
fi
source backend/.venv/bin/activate
pip install -q -r backend/requirements.txt
echo "Backend deps OK"

# Frontend deps
if ! [ -d frontend/node_modules ]; then
  (cd frontend && npm install)
fi
echo "Frontend deps OK"

# .env from example if missing
if ! [ -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

echo "Done. Run ./scripts/run_dev.sh to start backend + frontend."
