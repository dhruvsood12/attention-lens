#!/usr/bin/env bash
# Train all baselines (text, image, multimodal). Requires data in ml/data/.
# TODO: point to real scripts once implemented.
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Training pipeline not yet implemented."
echo "Next steps:"
echo "  1. Add datasets under ml/data/"
echo "  2. Implement ml/src/data/loaders.py and target_engineering"
echo "  3. Implement ml/src/models/train_*.py"
echo "  4. Run this script to train and save models to ml/saved_models/"
