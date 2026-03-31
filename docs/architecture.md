# AttentionLens — Architecture

## Overview

AttentionLens is a monorepo containing:

- **frontend** — Vite + React Router, TypeScript, Tailwind (Lovable UI). Landing, Analyze, Compare, Methodology.
- **backend** — FastAPI, Pydantic. REST API for prediction and comparison.
- **ml** — Data loaders, feature engineering, training scripts, evaluation, inference pipeline.

Data flow: User input (text/image) → Frontend → Backend API → Predictor service (mock or ML pipeline) → Response (score, bucket, explanations, recommendations).

## Backend

- **app/main.py** — FastAPI app, CORS, route registration.
- **app/api/** — Routes: `/health`, `/predict/text`, `/predict/image`, `/predict/multimodal`, `/compare`, `/model/info`.
- **app/schemas/** — Pydantic request/response models.
- **app/services/predictor.py** — Mock predictor; replace with ML inference when models exist.
- **app/core/config.py** — Settings from env (e.g. `USE_MOCK_PREDICTOR`, model paths).

When `USE_MOCK_PREDICTOR=true`, all prediction routes use the mock service. When false, the backend should load models from `ml/saved_models/` and call the ML inference pipeline (TODO).

## Frontend

- **src/pages/Landing.tsx** — Landing: hero, product framing, CTA.
- **src/pages/Analyze.tsx** — Analyze: form input, optional thumbnail, results panel.
- **src/pages/Compare.tsx** — Compare: A/B title ranking flow.
- **src/pages/Methodology.tsx** — Methodology and limitations.
- **src/lib/api.ts** — Client for backend API (`/predict/*`, `/compare`).
- **src/components/** — Layout and UI components (Navbar, Footer, ResultPanel, etc.).

## ML Pipeline (planned)

- **data/** — Loaders for YouTube, Reddit, social text; merge and normalize engagement.
- **features/** — Text (handcrafted + sentence-transformers), image (CLIP + stats), target (0–100 score, buckets).
- **models/** — Train baselines (dumb, text, image, multimodal); save to saved_models/.
- **evaluation/** — Regression (MAE, RMSE, R²), classification (F1, confusion), ranking (pairwise accuracy).
- **inference/** — Pipeline: preprocess → model → explainability → API response.

## Running locally

1. `./scripts/setup.sh` — venv, npm install, .env.
2. Backend: `./scripts/run_backend.sh` (or `cd backend && uvicorn app.main:app --reload --port 8000`).
3. Frontend: `cd frontend && npm run dev` (port 3000).
4. Open http://localhost:3000 and use Analyze; API at http://localhost:8000/docs.
