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

<img width="702" height="617" alt="Screenshot 2026-03-26 at 7 53 00 PM" src="https://github.com/user-attachments/assets/2c64c688-12d2-4631-ba1a-b8d2fd26978a" />
<img width="705" height="352" alt="Screenshot 2026-03-26 at 7 53 04 PM" src="https://github.com/user-attachments/assets/db52854d-b963-42e7-b784-3e41c8682c5d" />
<img width="1275" height="630" alt="Screenshot 2026-03-26 at 7 53 11 PM" src="https://github.com/user-attachments/assets/84007b90-b3d4-4169-ace4-1fae360da2af" />
<img width="294" height="561" alt="Screenshot 2026-03-26 at 7 54 06 PM" src="https://github.com/user-attachments/assets/a0a5dab6-45a3-4f78-aab4-4744aa55c6f1" />
<img width="303" height="558" alt="Screenshot 2026-03-26 at 7 54 45 PM" src="https://github.com/user-attachments/assets/f6832b4d-d01f-4621-b95d-ab3529eb0876" />
<img width="301" height="554" alt="Screenshot 2026-03-26 at 7 54 51 PM" src="https://github.com/user-attachments/assets/9d12c871-5706-41dc-9361-3836eb8dbbd5" />
<img width="274" height="597" alt="Screenshot 2026-03-26 at 7 54 54 PM" src="https://github.com/user-attachments/assets/a0f20b26-b1be-4db1-ba59-8ba88a2f3c14" />


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
- **Audit**: See [docs/audit.md](docs/audit.md) for a full repo audit (security + recruiter-readiness) and a prioritized hardening list.


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
cd ~/attention-lens/frontend && npm run dev
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

## Security

See [SECURITY.md](SECURITY.md) for the threat model and current protections (CORS hardening, payload caps, rate limiting).

Run the security/auth test matrix with:
```bash
cd backend && pytest -q
```

These checks validate input validation (`422`), payload caps (`413`), rate limiting (`429`), and current CORS policy behavior using FastAPI `TestClient` (see `backend/tests/`).

---

## Future work

- Phase 2: Richer explainability, category-specific calibration, session history, save analyses, LLM-backed rewrite suggestions.
- Phase 3: Auth, projects/workspaces, batch analysis, API keys, cloud storage, platform-specific model routing.

---

## License

MIT 
