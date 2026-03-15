"""
Dataset loaders for YouTube, Reddit, and social text.
Engagement is normalized (log transform, percentile) via target_engineering.
"""

from __future__ import annotations

import os
from typing import Optional, Any

import pandas as pd


# Standard column names we expect or produce
COL_TEXT = "text"
COL_ENGAGEMENT = "engagement"  # raw count (views, likes, score, etc.)
COL_PLATFORM = "platform"
COL_CATEGORY = "category"


def load_csv(
    path: str,
    text_col: str = "text",
    engagement_col: str = "views",
    platform: Optional[str] = None,
    drop_na_engagement: bool = True,
) -> pd.DataFrame:
    """
    Load a CSV with at least text and one engagement column.
    Returns DataFrame with columns COL_TEXT, COL_ENGAGEMENT, optionally COL_PLATFORM.
    """
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Dataset not found: {path}")
    df = pd.read_csv(path)
    if text_col not in df.columns:
        raise ValueError(f"CSV must have column '{text_col}'. Found: {list(df.columns)}")
    if engagement_col not in df.columns:
        raise ValueError(f"CSV must have column '{engagement_col}'. Found: {list(df.columns)}")

    out = pd.DataFrame()
    out[COL_TEXT] = df[text_col].astype(str)
    out[COL_ENGAGEMENT] = pd.to_numeric(df[engagement_col], errors="coerce")
    if platform:
        out[COL_PLATFORM] = platform
    if drop_na_engagement:
        out = out.dropna(subset=[COL_ENGAGEMENT])
    return out.reset_index(drop=True)


def load_youtube(path: Optional[str] = None) -> pd.DataFrame:
    """
    Load YouTube metadata CSV. Expected columns: title (or text), views, optionally
    likes, comments, category. Uses views as engagement.
    """
    path = path or os.path.join(os.path.dirname(__file__), "..", "..", "data", "youtube.csv")
    text_col = "title" if "title" in pd.read_csv(path, nrows=0).columns else "text"
    df = load_csv(path, text_col=text_col, engagement_col="views", platform="youtube")
    return df


def load_reddit(path: Optional[str] = None) -> pd.DataFrame:
    """
    Load Reddit posts CSV. Expected columns: title (or text), score or upvotes,
    optionally num_comments, subreddit.
    """
    path = path or os.path.join(os.path.dirname(__file__), "..", "..", "data", "reddit.csv")
    df = pd.read_csv(path)
    text_col = "title" if "title" in df.columns else "text"
    eng_col = "score" if "score" in df.columns else "upvotes"
    df = load_csv(path, text_col=text_col, engagement_col=eng_col, platform="reddit")
    return df


def load_social_text(path: Optional[str] = None) -> pd.DataFrame:
    """Load social post text CSV with engagement (e.g. likes, replies)."""
    path = path or os.path.join(os.path.dirname(__file__), "..", "..", "data", "social.csv")
    df = load_csv(path, text_col="text", engagement_col="likes", platform="twitter")
    return df


def load_merged(
    paths: Optional[dict[str, str]] = None,
    sample_per_platform: Optional[int] = None,
) -> pd.DataFrame:
    """
    Load and merge multiple datasets. paths: {"youtube": "/path/to/yt.csv", "reddit": "/path/to/reddit.csv"}.
    If paths is None, tries default locations and skips missing files.
    """
    paths = paths or {}
    dfs: list[pd.DataFrame] = []
    loaders = [
        ("youtube", load_youtube, paths.get("youtube")),
        ("reddit", load_reddit, paths.get("reddit")),
        ("social", load_social_text, paths.get("social")),
    ]
    for name, loader, custom_path in loaders:
        try:
            df = loader(custom_path) if custom_path else loader(None)
            if COL_PLATFORM not in df.columns:
                df[COL_PLATFORM] = name
            if sample_per_platform and len(df) > sample_per_platform:
                df = df.sample(n=sample_per_platform, random_state=42)
            dfs.append(df)
        except (FileNotFoundError, ValueError):
            continue
    if not dfs:
        return pd.DataFrame(columns=[COL_TEXT, COL_ENGAGEMENT, COL_PLATFORM])
    return pd.concat(dfs, ignore_index=True)
