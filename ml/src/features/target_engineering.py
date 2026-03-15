"""
Target variable engineering: normalized engagement score (0–100), buckets (low/medium/high).
Supports regression and classification targets.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from typing import Optional

# Bucket boundaries (score 0–100) -> low / medium / high
DEFAULT_BINS = [0, 40, 65, 100]
BUCKET_LABELS = ["low", "medium", "high"]


def build_regression_target(
    series: pd.Series,
    log_transform: bool = True,
    percentile_scale: bool = True,
) -> pd.Series:
    """
    Build a 0–100 normalized engagement score from raw counts.
    - log_transform: apply log1p to raw engagement before scaling
    - percentile_scale: map to 0–100 by percentile (robust to outliers)
    """
    s = series.astype(float).clip(lower=0)
    if log_transform:
        s = np.log1p(s)
    if percentile_scale:
        # 0–100 by percentile rank
        out = s.rank(pct=True, method="average") * 100
    else:
        # min-max to 0–100
        min_s, max_s = s.min(), s.max()
        if max_s <= min_s:
            out = pd.Series(50.0, index=s.index)
        else:
            out = (s - min_s) / (max_s - min_s) * 100
    return out.round(2)


def build_bucket_target(
    score_series: pd.Series,
    bins: Optional[list[float]] = None,
    labels: Optional[list[str]] = None,
) -> pd.Series:
    """
    Build low/medium/high bucket from a 0–100 score series.
    bins: e.g. [0, 40, 65, 100] -> three buckets.
    """
    bins = bins or DEFAULT_BINS
    labels = labels or BUCKET_LABELS
    return pd.cut(score_series, bins=bins, labels=labels, include_lowest=True)


def score_to_bucket(score: float, bins: Optional[list[float]] = None) -> str:
    """Map a single score (0–100) to bucket label."""
    bins = bins or DEFAULT_BINS
    if score < bins[1]:
        return "low"
    if score < bins[2]:
        return "medium"
    return "high"
