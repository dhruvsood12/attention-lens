# Modeling Approach

## Targets

- **Regression**: Normalized engagement score 0–100 (from log-transformed counts, percentiles within platform/category).
- **Classification**: Buckets low / medium / high (e.g. 0–40, 40–65, 65–100).
- **Ranking**: Pairwise or listwise for “which title is best” (optional).

MVP prioritizes regression + bucketed interpretation.

## Features

**Text**: Length, word count, punctuation, numbers, caps ratio, sentiment, readability; sentence-transformers embeddings; optional hook features (curiosity, listicle, urgency).

**Image**: CLIP (or CLIP-style) embeddings; simple stats (brightness, contrast, saturation); optional face/text-on-image.

**Multimodal**: Concatenate text embedding + image embedding + handcrafted; feed to gradient boosting or small MLP.

## Baselines

1. Dumb: mean predictor / dummy regressor.
2. Text-only: linear or gradient boosting on text features.
3. Image-only: CLIP embedding + gradient boosting.
4. Multimodal: Concatenated features + boosting (or MLP).
5. (Optional) Neural fusion model.

## Evaluation

- Regression: MAE, RMSE, R², Spearman.
- Classification: Accuracy, P/R/F1, confusion matrix, ROC-AUC.
- Ranking: Pairwise ranking accuracy, top-choice accuracy.
- Train/val/test split; cross-validation; per-platform/category where possible.

## Explainability

- Model-level: feature importance, SHAP if feasible.
- Heuristic layer: human-readable drivers (“length in good range”, “question framing helps”).
- Per-input: strongest positive/negative signals, confidence band.
- Rule-based suggestions first; later enhance with LLM.
