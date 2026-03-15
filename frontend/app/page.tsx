import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-28 text-center">
        <p className="text-accent font-medium text-sm uppercase tracking-wider mb-4">
          Cognitive Science × Machine Learning
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance max-w-3xl mx-auto mb-6">
          Predict attention before you post
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          AttentionLens uses multimodal ML to score headlines, thumbnails, and captions—
          so you can pick the content that will capture attention, not guess.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Analyze your content
          </Link>
          <Link
            href="/methodology"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* Value props */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Built for creators and growth teams
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-medium mb-2">Title testing</h3>
              <p className="text-sm text-muted-foreground">
                Enter multiple YouTube or article titles. Get ranked predictions and see which hooks work best.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-medium mb-2">Thumbnail evaluation</h3>
              <p className="text-sm text-muted-foreground">
                Upload a thumbnail and optional title. Understand visual impact and get improvement suggestions.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-medium mb-2">Explainable scores</h3>
              <p className="text-sm text-muted-foreground">
                See why a score is high or low—length, curiosity, specificity—and actionable recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">
          No account required for the demo. Start analyzing in one click.
        </p>
        <Link
          href="/analyze"
          className="text-accent font-medium hover:underline"
        >
          Go to Analyze →
        </Link>
      </section>
    </div>
  );
}
