#!/usr/bin/env bash
# Start backend and frontend in dev mode (two processes)
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Load .env for backend
if [ -f .env ]; then export $(grep -v '^#' .env | xargs); fi

# Backend (run from backend dir so app resolves)
if [ -d backend/.venv ]; then
  source backend/.venv/bin/activate
fi
(cd backend && uvicorn app.main:app --reload --host "${API_HOST:-0.0.0.0}" --port "${API_PORT:-8000}") &
BACKEND_PID=$!

# Frontend (Vite)
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo "Backend PID $BACKEND_PID (http://localhost:8000)"
echo "Frontend PID $FRONTEND_PID (http://localhost:3000)"
echo "Ctrl+C to stop both."
wait $BACKEND_PID $FRONTEND_PID
