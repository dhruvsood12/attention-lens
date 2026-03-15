"""
Target variable engineering: normalized engagement score (0–100), buckets (low/medium/high).
Supports regression, classification, and ranking targets.
TODO: Implement once datasets and engagement columns are defined.
"""

def build_regression_target(series, log_transform: bool = True):
    """Build 0–100 normalized engagement score. TODO."""
    raise NotImplementedError("Implement after dataset loaders.")

def build_bucket_target(series, bins: list[float] = [0, 40, 65, 100]):
    """Build low/medium/high buckets from score. TODO."""
    raise NotImplementedError("Implement after regression target.")
