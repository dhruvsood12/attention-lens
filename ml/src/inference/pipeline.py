"""
End-to-end inference pipeline for the API.
Composes preprocessing, model loading, and explanation/suggestion layers.
TODO: Wire to backend when models are trained; backend currently uses mock.
"""

def run_text_pipeline(text: str, platform: str | None = None) -> dict:
    """Preprocess text -> features -> model -> response dict. TODO."""
    raise NotImplementedError("Wire to train_text_model output and explainability.")

def run_multimodal_pipeline(text: str, image_input, platform: str | None = None) -> dict:
    """Preprocess text + image -> features -> fusion model -> response. TODO."""
    raise NotImplementedError("Wire to train_multimodal_model and explainability.")
