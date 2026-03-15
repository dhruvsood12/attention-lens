"""
Dataset loaders for YouTube, Reddit, and social text.
Design supports multiple sources; engagement is normalized (log transform, percentile).
TODO: Implement concrete loaders once datasets are available.
"""

# Placeholder: define loader interfaces and return empty DataFrames until data exists.
# from .clean_youtube import load_youtube
# from .clean_reddit import load_reddit
# from .merge_datasets import merge_and_normalize

def load_youtube(path: str | None = None):
    """Load YouTube metadata (title, thumbnail, views, likes, etc.). TODO."""
    raise NotImplementedError("Add YouTube dataset and implement loader.")

def load_reddit(path: str | None = None):
    """Load Reddit posts (title, subreddit, score, num_comments). TODO."""
    raise NotImplementedError("Add Reddit dataset and implement loader.")

def load_social_text(path: str | None = None):
    """Load social post text and engagement. TODO."""
    raise NotImplementedError("Add social text dataset and implement loader.")
