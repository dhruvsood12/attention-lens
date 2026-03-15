import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import ImageUpload from "@/components/shared/ImageUpload";
import PlatformSelector from "@/components/shared/PlatformSelector";
import ResultPanel from "@/components/shared/ResultPanel";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/StateViews";
import { analyzeContent, type AnalysisResult, type Platform, ApiError } from "@/lib/api";

export default function Analyze() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform | undefined>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await analyzeContent({
        title: title.trim(),
        body: body.trim() || undefined,
        thumbnailUrl: thumbnailUrl ?? undefined,
        platform,
      });
      setResult(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setBody("");
    setThumbnailUrl(null);
    setPlatform(undefined);
    setResult(null);
    setError(null);
  };

  return (
    <PageLayout>
      <div className="relative">
        <div className="absolute inset-0 dot-bg opacity-30" />
        <div className="relative container section-padding max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Analyze Content</h1>
            <p className="text-muted-foreground">Enter a headline or title to predict its engagement potential.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="title-input" className="text-sm font-medium mb-2 block">Title / Headline / Caption *</label>
                <input
                  id="title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='e.g., "Why Most Founders Get Pricing Wrong"'
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAnalyze()}
                />
              </div>
              <div>
                <label htmlFor="body-input" className="text-sm font-medium mb-2 block">Body / Description <span className="text-muted-foreground">(optional)</span></label>
                <textarea
                  id="body-input"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Add a subtitle, description, or opening paragraph for deeper analysis..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none"
                />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Thumbnail <span className="text-muted-foreground">(optional)</span></label>
                  <ImageUpload value={thumbnailUrl} onChange={setThumbnailUrl} />
                </div>
                <PlatformSelector value={platform} onChange={setPlatform} />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleAnalyze}
                  disabled={!title.trim() || loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4" /> {loading ? "Analyzing..." : "Analyze"}
                </button>
                {(result || error) && (
                  <button onClick={handleReset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">
                    <RotateCcw className="h-4 w-4" /> Reset
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading && <LoadingState key="loading" title="Running multi-signal analysis..." subtitle="Scoring curiosity gap, emotional impact, clarity, and more" />}
            {error && !loading && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ErrorState message={error} onRetry={handleAnalyze} />
              </motion.div>
            )}
            {result && !loading && !error && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ResultPanel result={result} />
              </motion.div>
            )}
            {!result && !loading && !error && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmptyState icon={<ArrowRight className="h-8 w-8" />} title="Enter a title to get started" description="Paste a headline, caption, or title above and hit Analyze to see engagement predictions." />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
}
