#!/usr/bin/env bash
# Run backend only (from repo root so .env and paths work)
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
if [ -f .env ]; then export $(grep -v '^#' .env | xargs); fi
if [ -d backend/.venv ]; then source backend/.venv/bin/activate; fi
cd backend && PYTHONPATH=.. uvicorn app.main:app --reload --host "${API_HOST:-0.0.0.0}" --port "${API_PORT:-8000}"
