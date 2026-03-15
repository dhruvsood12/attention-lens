"use client";

import { useState } from "react";
import { ResultsCard } from "@/components/ResultsCard";
import { CompareResults } from "@/components/CompareResults";
import {
  predictText,
  predictMultimodal,
  compareCandidates,
  type PredictionResponse,
  type CompareResponse,
} from "@/lib/api";

type Mode = "single" | "compare";

export default function AnalyzePage() {
  const [mode, setMode] = useState<Mode>("single");
  const [text, setText] = useState("");
  const [compareTexts, setCompareTexts] = useState(["", "", ""]);
  const [platform, setPlatform] = useState("youtube");
  const [contentType, setContentType] = useState("title");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [compareResult, setCompareResult] = useState<CompareResponse | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setImageBase64(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
  };

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);
    setCompareResult(null);
    if (mode === "single") {
      if (!text.trim()) {
        setError("Enter some text to analyze.");
        return;
      }
      setLoading(true);
      try {
        const res = imageBase64
          ? await predictMultimodal(text.trim(), imageBase64, undefined, platform, contentType)
          : await predictText(text.trim(), platform, contentType);
        setResult(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Request failed.");
      } finally {
        setLoading(false);
      }
    } else {
      const filled = compareTexts.filter((t) => t.trim());
      if (filled.length < 2) {
        setError("Add at least 2 candidates to compare.");
        return;
      }
      setLoading(true);
      try {
        const res = await compareCandidates(
          filled.map((t, i) => ({ id: `c${i + 1}`, text: t.trim() })),
          platform,
          contentType
        );
        setCompareResult(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Request failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Analyze content</h1>
      <p className="text-muted-foreground mb-8">
        Enter a headline, title, or caption. Optionally add a thumbnail. Get a score and suggestions.
      </p>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMode("single")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "single"
              ? "bg-accent text-white"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Single
        </button>
        <button
          type="button"
          onClick={() => setMode("compare")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "compare"
              ? "bg-accent text-white"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Compare titles
        </button>
      </div>

      {mode === "single" ? (
        <>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. I Tried X For 30 Days — Here's What Happened"
                className="w-full min-h-[120px] rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                maxLength={10000}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter</option>
                  <option value="reddit">Reddit</option>
                  <option value="article">Article</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="title">Title</option>
                  <option value="caption">Caption</option>
                  <option value="headline">Headline</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail (optional)</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/80"
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Remove
                  </button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border w-40 h-24 relative">
                  <img
                    src={imagePreview}
                    alt="Thumbnail preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4 mb-6">
          <p className="text-sm text-muted-foreground">
            Enter up to 3 title candidates. We'll rank them by predicted attention.
          </p>
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <label className="block text-sm font-medium mb-2">Candidate {i + 1}</label>
              <input
                type="text"
                value={compareTexts[i]}
                onChange={(e) => {
                  const next = [...compareTexts];
                  next[i] = e.target.value;
                  setCompareTexts(next);
                }}
                placeholder={`Title option ${i + 1}`}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
                <option value="reddit">Reddit</option>
                <option value="article">Article</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="title">Title</option>
                <option value="caption">Caption</option>
                <option value="headline">Headline</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading}
        className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? "Analyzing…" : mode === "compare" ? "Compare" : "Analyze"}
      </button>

      {error && (
        <div className="mt-4 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Results</h2>
          <ResultsCard data={result} />
        </div>
      )}

      {compareResult && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Ranking</h2>
          <CompareResults data={compareResult} />
        </div>
      )}
    </div>
  );
}
