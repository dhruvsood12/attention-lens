"use client";

import type { PredictionResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ResultsCard({ data }: { data: PredictionResponse }) {
  const bucketColors: Record<string, string> = {
    low: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    medium: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    high: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  };
  const bucketLabel = data.bucket.toLowerCase();

  return (
    <div className="animate-slide-up rounded-xl border border-border bg-card p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Attention score</p>
          <p className="text-3xl font-bold tabular-nums">{data.score.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Confidence: {(data.confidence * 100).toFixed(0)}%
          </p>
        </div>
        <span
          className={cn(
            "inline-flex rounded-full border px-3 py-1 text-sm font-medium capitalize",
            bucketColors[bucketLabel] ?? "bg-muted text-muted-foreground border-border"
          )}
        >
          {data.bucket}
        </span>
      </div>

      {data.explanations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Key drivers</h4>
          <ul className="space-y-2">
            {data.explanations.map((e, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm"
              >
                <span
                  className={cn(
                    "shrink-0 w-2 h-2 rounded-full mt-1.5",
                    e.direction === "positive" && "bg-emerald-500",
                    e.direction === "negative" && "bg-amber-500",
                    e.direction === "neutral" && "bg-zinc-500"
                  )}
                />
                <span className="text-muted-foreground">{e.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Suggestions</h4>
          <ul className="space-y-2">
            {data.recommendations.map((r, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>{r.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-muted-foreground pt-2 border-t border-border">
        Model: {data.model_used}
      </p>
    </div>
  );
}
