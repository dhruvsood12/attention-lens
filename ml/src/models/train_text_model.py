"""
Train text-only baseline: handcrafted features -> gradient boosting regressor.
Saves model and feature names to saved_models/ for inference.
"""

from __future__ import annotations

import argparse
import os
import sys
from datetime import datetime, timezone
from typing import Optional

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Resolve paths: run as python -m ml.src.models.train_text_model from repo root
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", ".."))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from ml.src.data.loaders import load_csv, COL_TEXT, COL_ENGAGEMENT
from ml.src.features.target_engineering import build_regression_target
from ml.src.features.text_features import extract_text_features_batch

FEATURE_ORDER = [
    "text_length",
    "word_count",
    "exclamation_count",
    "question_count",
    "period_count",
    "has_number",
    "caps_ratio",
    "words_per_sentence",
    "listicle",
    "curiosity_gap",
]

ARTIFACT_VERSION = 1


def build_feature_matrix(df: pd.DataFrame, text_col: str = COL_TEXT) -> np.ndarray:
    """Build numeric feature matrix from text column."""
    texts = df[text_col].astype(str).tolist()
    feats = extract_text_features_batch(texts)
    rows = [[f.get(k, 0.0) for k in FEATURE_ORDER] for f in feats]
    return np.asarray(rows, dtype=np.float64)


def train(
    data_path: Optional[str] = None,
    text_col: str = "text",
    engagement_col: str = "views",
    output_dir: Optional[str] = None,
    test_size: float = 0.2,
    random_state: int = 42,
) -> dict:
    """
    Load data, build features and target, train model, save to output_dir.
    Returns dict with metrics and path to saved model.
    """
    if output_dir is None:
        output_dir = os.path.join(SCRIPT_DIR, "..", "..", "saved_models")
    os.makedirs(output_dir, exist_ok=True)

    if data_path and os.path.isfile(data_path):
        df = load_csv(data_path, text_col=text_col, engagement_col=engagement_col)
    else:
        # Synthetic data for demo when no dataset present
        np.random.seed(random_state)
        n = 500
        df = pd.DataFrame({
            COL_TEXT: [f"Example title number {i} with some words" for i in range(n)],
            COL_ENGAGEMENT: np.random.lognormal(8, 2, n).astype(int),
        })
        # Slight signal: longer titles get a bit more engagement in synthetic data
        df[COL_TEXT] = df[COL_TEXT] + " " + (df[COL_ENGAGEMENT] % 5).astype(str).replace("0", "")

    y_raw = df[COL_ENGAGEMENT]
    y = build_regression_target(y_raw, log_transform=True, percentile_scale=True)
    X = build_feature_matrix(df, COL_TEXT)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    model = GradientBoostingRegressor(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.1,
        random_state=random_state,
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test).clip(0, 100)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    artifact = {
        "artifact_version": ARTIFACT_VERSION,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "model_type": "sklearn.GradientBoostingRegressor",
        "target": {
            "name": "normalized_engagement_score",
            "range": [0, 100],
            "transform": "log1p_then_percentile_rank",
        },
        "model": model,
        "feature_order": FEATURE_ORDER,
        "bins": [0, 40, 65, 100],
    }
    out_path = os.path.join(output_dir, "text_baseline.joblib")
    joblib.dump(artifact, out_path)

    return {
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
        "n_train": len(X_train),
        "n_test": len(X_test),
        "model_path": out_path,
    }


def main():
    parser = argparse.ArgumentParser(description="Train text baseline model")
    parser.add_argument("--data", type=str, default=None, help="Path to CSV (optional)")
    parser.add_argument("--text-col", type=str, default="text")
    parser.add_argument("--engagement-col", type=str, default="views")
    parser.add_argument("--output-dir", type=str, default=None)
    parser.add_argument("--test-size", type=float, default=0.2)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()
    result = train(
        data_path=args.data,
        text_col=args.text_col,
        engagement_col=args.engagement_col,
        output_dir=args.output_dir,
        test_size=args.test_size,
        random_state=args.seed,
    )
    print("Training done.", result)


if __name__ == "__main__":
    main()
