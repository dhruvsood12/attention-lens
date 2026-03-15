import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, Plus, X, Trophy } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PlatformSelector from "@/components/shared/PlatformSelector";
import ImageUpload from "@/components/shared/ImageUpload";
import ScoreRing from "@/components/ui/ScoreRing";
import MetricBar from "@/components/ui/MetricBar";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/StateViews";
import { compareTitles, type CompareResult, type Platform, ApiError } from "@/lib/api";

export default function Compare() {
  const [titles, setTitles] = useState(["", "", ""]);
  const [platform, setPlatform] = useState<Platform | undefined>();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateTitle = (index: number, value: string) => {
    setTitles((prev) => prev.map((t, i) => (i === index ? value : t)));
  };
  const addTitle = () => { if (titles.length < 5) setTitles((prev) => [...prev, ""]); };
  const removeTitle = (index: number) => { if (titles.length > 2) setTitles((prev) => prev.filter((_, i) => i !== index)); };
  const validCount = titles.filter((t) => t.trim()).length;

  const handleCompare = async () => {
    if (validCount < 2) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await compareTitles({
        titles: titles.filter((t) => t.trim()),
        platform,
        thumbnailUrl: thumbnailUrl ?? undefined,
      });
      setResult(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Comparison failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitles(["", "", ""]);
    setPlatform(undefined);
    setThumbnailUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <PageLayout>
      <div className="relative">
        <div className="absolute inset-0 dot-bg opacity-30" />
        <div className="relative container section-padding max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Compare Titles</h1>
            <p className="text-muted-foreground">Test multiple variants head-to-head and find your strongest option.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-8">
            <div className="space-y-3 mb-5">
              {titles.map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-muted-foreground w-5 shrink-0 text-center">{String.fromCharCode(65 + i)}</span>
                  <input
                    type="text"
                    value={t}
                    onChange={(e) => updateTitle(i, e.target.value)}
                    placeholder={`Title variant ${String.fromCharCode(65 + i)}...`}
                    className="flex-1 px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  />
                  {titles.length > 2 && (
                    <button onClick={() => removeTitle(i)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" aria-label={`Remove variant ${String.fromCharCode(65 + i)}`}>
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="grid gap-5 md:grid-cols-2 mb-5">
              <div>
                <label className="text-sm font-medium mb-2 block">Shared Thumbnail <span className="text-muted-foreground">(optional)</span></label>
                <ImageUpload value={thumbnailUrl} onChange={setThumbnailUrl} />
              </div>
              <PlatformSelector value={platform} onChange={setPlatform} />
            </div>
            <div className="flex gap-3">
              <button onClick={handleCompare} disabled={validCount < 2 || loading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <GitCompare className="h-4 w-4" /> {loading ? "Comparing..." : "Compare"}
              </button>
              {titles.length < 5 && (
                <button onClick={addTitle} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">
                  <Plus className="h-4 w-4" /> Add Variant
                </button>
              )}
              {(result || error) && (
                <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors ml-auto">
                  Reset
                </button>
              )}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading && <LoadingState key="loading" title={`Comparing ${validCount} variants...`} subtitle="Ranking by engagement signals across all dimensions" />}
            {error && !loading && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ErrorState message={error} onRetry={handleCompare} />
              </motion.div>
            )}
            {result && !loading && !error && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-card glow-border p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Top Pick</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.reasoning}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-5">
                  {result.ranked.map((item, idx) => {
                    const isWinner = item.rank === 1;
                    const r = item.result;
                    return (
                      <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.12 }} className={`glass-card overflow-hidden ${isWinner ? "glow-border ring-1 ring-primary/30" : ""}`}>
                        <div className="p-5 sm:p-6 border-b border-border/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-secondary text-muted-foreground">#{item.rank}</span>
                              {isWinner && <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary">Winner</span>}
                              {item.deltaFromBest > 0 && <span className="text-xs font-mono text-muted-foreground">−{item.deltaFromBest} pts</span>}
                            </div>
                            <ScoreRing score={r.overallScore} size={56} strokeWidth={4} showLabel={false} />
                          </div>
                          <p className="text-sm font-medium leading-relaxed">"{r.title}"</p>
                        </div>
                        <div className="p-5 sm:p-6">
                          <div className="grid gap-5 md:grid-cols-2">
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Signals</h4>
                              <div className="space-y-3">
                                {r.signals.slice(0, 5).map((s, i) => (
                                  <MetricBar key={s.name} label={s.label} value={s.score} delay={i * 0.06} />
                                ))}
                              </div>
                            </div>
                            <div className="space-y-5">
                              {r.drivers.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Strengths</h4>
                                  <ul className="space-y-2">
                                    {r.drivers.map((d, i) => (
                                      <li key={i} className="flex items-start gap-2 text-xs">
                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-chart-excellent shrink-0" />
                                        <span className="text-secondary-foreground">{d}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {r.weaknesses.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Weak Points</h4>
                                  <ul className="space-y-2">
                                    {r.weaknesses.map((w, i) => (
                                      <li key={i} className="flex items-start gap-2 text-xs">
                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-chart-poor shrink-0" />
                                        <span className="text-secondary-foreground">{w}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            {!result && !loading && !error && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmptyState icon={<GitCompare className="h-8 w-8" />} title="Enter at least two title variants" description="Add your title options above and hit Compare to see which one has the strongest engagement signals." />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
}
