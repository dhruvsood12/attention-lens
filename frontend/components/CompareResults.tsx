"use client";

import type { CompareResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

export function CompareResults({ data }: { data: CompareResponse }) {
  const bucketColors: Record<string, string> = {
    low: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    medium: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    high: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  };

  return (
    <div className="animate-slide-up space-y-4">
      {data.summary && (
        <p className="text-sm text-muted-foreground">{data.summary}</p>
      )}
      <div className="space-y-3">
        {data.ranked.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-border bg-card p-4 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                #{r.rank}
              </span>
              <span className="font-medium">Candidate {r.id}</span>
              <span
                className={cn(
                  "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                  bucketColors[r.bucket.toLowerCase()] ?? "bg-muted text-muted-foreground border-border"
                )}
              >
                {r.bucket}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold tabular-nums">{r.score.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">
                {(r.confidence * 100).toFixed(0)}% confidence
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Model: {data.model_used}</p>
    </div>
  );
}
