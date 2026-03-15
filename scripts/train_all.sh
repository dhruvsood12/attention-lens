#!/usr/bin/env bash
# Train all baselines (text, image, multimodal). Run from repo root.
# Text baseline: uses synthetic data if no CSV provided; saves to ml/saved_models/.
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Training text baseline..."
pip install -q pandas numpy scikit-learn joblib 2>/dev/null || true
PYTHONPATH=. python -m ml.src.models.train_text_model "$@"
echo "Done. Model saved to ml/saved_models/text_baseline.joblib"
echo "Set USE_MOCK_PREDICTOR=false and restart backend to use the real model."
