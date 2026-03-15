"""
Inference entry point: load saved model(s) and run prediction.
Used by backend inference pipeline when USE_MOCK_PREDICTOR=false.
TODO: Load joblib/pickle models and call pipeline.
"""

def predict_text(text: str, model_path: str) -> dict:
    """Run text model inference. TODO: load model, extract features, predict."""
    raise NotImplementedError("Implement after train_text_model produces saved model.")

def predict_image(image_path_or_array, model_path: str) -> dict:
    """Run image model inference. TODO."""
    raise NotImplementedError("Implement after train_image_model.")

def predict_multimodal(text: str, image_path_or_array, model_path: str) -> dict:
    """Run multimodal model inference. TODO."""
    raise NotImplementedError("Implement after train_multimodal_model.")
