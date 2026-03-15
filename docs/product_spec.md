# Product Spec — AttentionLens

## Vision

Multimodal ML product that predicts how much attention content will capture before it is posted. Positioned at the intersection of cognitive science, ML, creator tools, and attention economics. Demo-ready for recruiters and portfolio.

## Inputs

- Text: headline, tweet/caption, YouTube title.
- Image: thumbnail (upload or URL).
- Optional: platform, content type, category.

## Outputs

- Predicted engagement score (0–100).
- Bucket: low / medium / high.
- Key drivers (explainability).
- Improvement suggestions.
- Confidence level.
- Optional: comparison/ranking of multiple candidates.

## User Stories (MVP)

1. **Title testing** — User enters 3 YouTube title candidates (+ optional thumbnail). System ranks by attention potential.
2. **Headline testing** — User enters one headline; gets score and explanation.
3. **Social post preview** — User enters caption; gets engagement potential and suggestions.
4. **Thumbnail evaluation** — User uploads thumbnail (+ optional title); gets visual hook strength and tips.
5. **Multimodal** — User submits text + image; combined prediction and explanation.

## Phasing

- **Phase 1 (MVP)**: One web app, one API, one text + one image + one multimodal baseline, simple explanation and suggestions, title comparison UI, local inference (mock then real).
- **Phase 2**: Better explainability, category-specific calibration, session history, save analyses, LLM-backed rewrite suggestions.
- **Phase 3**: Auth, workspaces, batch analysis, API keys, cloud storage, platform-specific routing.

## Ethics / Limitations

Product predicts probable attention, not truth or moral value. Engagement can reflect bias and platform incentives. Predictions are platform- and audience-dependent. Do not optimize for misinformation or manipulation. Frame as decision support, not authority.
