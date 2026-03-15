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
├── frontend/          # Next.js (App Router), TypeScript, Tailwind
├── backend/           # FastAPI, Pydantic, prediction + compare API
├── ml/                # Data loaders, features, training, evaluation, inference
├── scripts/           # setup, run_dev, run_backend, train_all
└── docs/              # architecture, modeling, product_spec
```

- **Frontend**: Landing, Analyze (single + compare), Methodology. Calls backend for `/predict/*` and `/compare`.
- **Backend**: REST API; mock predictor by default; swap to real ML pipeline when models are trained.
- **ML**: Dataset loaders (YouTube, Reddit, social), feature engineering, baseline models (text, image, multimodal), evaluation, inference pipeline. See [docs/architecture.md](docs/architecture.md) and [docs/modeling.md](docs/modeling.md).

*[Optional: add a simple architecture diagram here.]*

---

## Stack

| Layer      | Tech |
|-----------|------|
| Frontend  | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend   | Python, FastAPI, Pydantic, Uvicorn |
| ML        | pandas, numpy, scikit-learn, lightgbm/xgboost, sentence-transformers, CLIP (planned) |
| Storage   | Local files + SQLite to start; structure allows Postgres later |

---

## Setup

1. **Clone and install**
   ```bash
   git clone <repo>
   cd attention-lens
   ./scripts/setup.sh
   ```
   This creates a backend venv, installs backend and frontend deps, and copies `.env.example` to `.env` if missing.

2. **Run backend** (from repo root)
   ```bash
   ./scripts/run_backend.sh
   ```
   API: http://localhost:8000 — docs at http://localhost:8000/docs

3. **Run frontend** (in another terminal)
   ```bash
   cd frontend && npm run dev
   ```
   App: http://localhost:3000

4. **Try it**  
   Open Analyze, enter a title or caption, optionally add a thumbnail or switch to “Compare titles.” Results use the **mock predictor** until you train and plug in real models.

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
