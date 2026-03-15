import Link from "next/link";

export default function MethodologyPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Methodology</h1>
      <p className="text-muted-foreground mb-8">
        How AttentionLens predicts attention potential—and what it does not do.
      </p>

      <div className="prose prose-invert prose-sm max-w-none space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-2">Modeling approach</h2>
          <p className="text-muted-foreground">
            We use a multimodal pipeline: text and thumbnail inputs are turned into features
            (handcrafted stats, semantic embeddings, and—for images—CLIP-style embeddings).
            A regression model predicts a normalized attention score (0–100), which we bucket
            into low / medium / high. We combine text-only, image-only, and fused models so
            you can analyze headlines, thumbnails, or both together.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Explainability</h2>
          <p className="text-muted-foreground">
            The product is designed to explain scores: feature importance, heuristic
            explanations (e.g. length, curiosity, specificity), and rule-based suggestions.
            The goal is decision support—helping you see why something might capture attention—
            not a black box number.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Limitations and ethics</h2>
          <p className="text-muted-foreground">
            AttentionLens predicts probable engagement, not truth, quality, or moral value.
            Engagement can reflect bias, controversy, and platform incentives. Predictions
            are platform- and audience-dependent and should not be used to optimize for
            misinformation or manipulative content. We frame this as a decision-support
            tool for creators and teams—not an authority on what to post.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Data and targets</h2>
          <p className="text-muted-foreground">
            The pipeline is built to support real datasets (e.g. YouTube metadata, Reddit
            posts, social text) with normalized engagement targets—e.g. log-transformed
            counts and percentile scores within platform/category—so models generalize
            better than raw counts alone.
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-border">
        <Link href="/analyze" className="text-accent font-medium hover:underline">
          ← Back to Analyze
        </Link>
      </div>
    </div>
  );
}
