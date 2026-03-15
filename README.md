# AttentionLens

**Predict attention before you post.**  
A multimodal machine learning web app that scores headlines, thumbnails, and captions so you can choose content that will capture attention—backed by cognitive science and ML.

---

## Why it matters

Creators and growth teams test copy and thumbnails by posting and hoping. AttentionLens turns that into a prediction: before you publish, you get a **score**, **explanation**, and **suggestions**. The stack is built for real data (YouTube, Reddit, social text) and normalized engagement targets, so the system is scalable beyond a toy demo.

- **Product**: One clean web app + API. Single and compare flows (e.g. rank 3 titles).
- **ML**: Text features (handcrafted + embeddings), image features (CLIP-style), multimodal fusion. Regression + bucketed interpretation + explainability.
- **Audience**: Recruiters, interviewers, hackathon judges, portfolio visitors—and anyone who cares about attention economics and creator tools.

---

## Screenshots

*[Add screenshots: landing, analyze form, results with score and drivers.]*

---

## Architecture

```
attentionlens/
├── frontend/          # Vite + React, TypeScript, Tailwind (Lovable UI)
├── backend/          # FastAPI, Pydantic, prediction + compare API
├── ml/               # Data loaders, features, training, evaluation, inference
├── scripts/          # setup, run_dev, run_backend, train_all
└── docs/             # architecture, modeling, product_spec
```

- **Frontend**: Vite + React app with Landing, Analyze, Compare, Methodology. Calls backend at `http://localhost:8000` (override with `VITE_API_BASE_URL`).
- **Backend**: REST API; mock predictor by default; swap to real ML pipeline when models are trained.
- **ML**: Dataset loaders (YouTube, Reddit, social), feature engineering, baseline models (text, image, multimodal), evaluation, inference pipeline. See [docs/architecture.md](docs/architecture.md) and [docs/modeling.md](docs/modeling.md).

*[Optional: add a simple architecture diagram here.]*

---

## Stack

| Layer      | Tech |
|-----------|------|
| Frontend  | Vite, React 18, TypeScript, Tailwind CSS, Framer Motion |
| Backend   | Python, FastAPI, Pydantic, Uvicorn |
| ML        | pandas, numpy, scikit-learn, lightgbm/xgboost, sentence-transformers, CLIP (planned) |
| Storage   | Local files + SQLite to start; structure allows Postgres later |

---

## How to run

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.10+

### 1. Clone and install
   ```bash
   git clone https://github.com/dhruvsood12/attention-lens.git
   cd attention-lens
   ./scripts/setup.sh
   ```
   This creates a backend venv, installs backend and frontend deps, and copies `.env.example` to `.env` if missing.

### 2. Start the backend

From repo root (in one terminal):

```bash
./scripts/run_backend.sh
```

- API: **http://localhost:8000** — Docs: **http://localhost:8000/docs**

### 3. Start the frontend

In a second terminal:

```bash
cd frontend && npm run dev
```

- App: **http://localhost:3000**

### 4. Use the app

- **Analyze**: Enter a title/headline (and optional thumbnail), pick a platform, hit Analyze.
- **Compare**: Enter 2–5 title variants and hit Compare to see them ranked.
- Results use the **mock predictor** by default. To use the trained text model: set `USE_MOCK_PREDICTOR=false` in `.env`, run `./scripts/train_all.sh` once, then restart the backend.


---

## Data pipeline

The codebase is structured for **real datasets**:

- **YouTube**: title, thumbnail, views, likes, comments, category (and optional publish time).
- **Reddit**: title, subreddit, score, num_comments.
- **Social text**: post text, likes/replies if available.
- **Optional**: article headlines + engagement proxy.

Engagement is **normalized** (e.g. log transform, percentile within platform/category) so targets are comparable. See `ml/src/data/` and [docs/modeling.md](docs/modeling.md). Data loaders are stubbed until you add datasets; see TODOs in `ml/src/data/loaders.py`.

---

## Modeling

- **Targets**: Regression (0–100 score), classification (low/medium/high), optional ranking.
- **Features**: Text (length, sentiment, readability, sentence-transformers), image (CLIP + simple stats), concatenated for multimodal.
- **Baselines**: Dumb, text-only, image-only, multimodal (concatenate + boosting or MLP).
- **Explainability**: Feature importance, heuristic explanations, rule-based suggestions; later SHAP/LLM if needed.

Evaluation: MAE, RMSE, R², Spearman; accuracy/F1/confusion for buckets; train/val/test and optional cross-validation. See [docs/modeling.md](docs/modeling.md).

---

## Evaluation

- Regression: MAE, RMSE, R², Spearman.
- Classification: Accuracy, precision/recall/F1, confusion matrix.
- Ranking: Pairwise ranking accuracy, top-choice accuracy.

Scripts live under `ml/src/evaluation/` (TODO until models exist).

---

## Limitations and ethics

- AttentionLens predicts **probable engagement**, not truth, quality, or moral value.
- Engagement can reflect bias, controversy, and platform incentives.
- Predictions are **platform- and audience-dependent**.
- The tool should **not** be used to optimize for misinformation or manipulative content.
- We frame it as **decision support** for creators and teams—not an authority on what to post.

See the [Methodology](http://localhost:3000/methodology) page in the app and [docs/product_spec.md](docs/product_spec.md).

---

## Future work

- Phase 2: Richer explainability, category-specific calibration, session history, save analyses, LLM-backed rewrite suggestions.
- Phase 3: Auth, projects/workspaces, batch analysis, API keys, cloud storage, platform-specific model routing.

---

## License

MIT (or your choice).
