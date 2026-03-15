// ============================================================
// AttentionLens — API Client (wired to FastAPI backend)
// ============================================================

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// --- Types (Lovable UI) -----------------------------------------------------

export type Platform = "youtube" | "twitter" | "linkedin" | "tiktok" | "instagram" | "blog" | "reddit";

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "X / Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "blog", label: "Blog / Article" },
  { value: "reddit", label: "Reddit" },
];

export interface AnalyzeRequest {
  title: string;
  body?: string;
  thumbnailUrl?: string;
  platform?: Platform;
}

export interface SignalScore {
  name: string;
  score: number;
  label: string;
  description: string;
}

export interface AnalysisResult {
  id: string;
  title: string;
  platform: Platform | null;
  overallScore: number;
  confidence: number;
  signals: SignalScore[];
  drivers: string[];
  weaknesses: string[];
  suggestions: string[];
  predictedCTR: number;
  predictedEngagement: number;
  timestamp: string;
}

export interface CompareRequest {
  titles: string[];
  platform?: Platform;
  thumbnailUrl?: string;
}

export interface RankedItem {
  rank: number;
  result: AnalysisResult;
  deltaFromBest: number;
}

export interface CompareResult {
  ranked: RankedItem[];
  reasoning: string;
  timestamp: string;
}

// --- Backend response types -------------------------------------------------

interface BackendExplanation {
  factor: string;
  direction: string;
  description: string;
  impact?: number;
}

interface BackendRecommendation {
  type: string;
  message: string;
  priority: string;
}

interface BackendPredictionResponse {
  score: number;
  bucket: string;
  confidence: number;
  explanations: BackendExplanation[];
  recommendations: BackendRecommendation[];
  model_used: string;
}

interface BackendRankedCandidate {
  id: string;
  rank: number;
  score: number;
  bucket: string;
  confidence: number;
  explanations: BackendExplanation[];
  recommendations: BackendRecommendation[];
}

interface BackendCompareResponse {
  ranked: BackendRankedCandidate[];
  model_used: string;
  summary?: string;
}

// --- Signal definitions for UI (derive from explanations or use defaults) ---

const SIGNAL_DEFS: { name: string; label: string; description: string }[] = [
  { name: "curiosityGap", label: "Curiosity Gap", description: "Creates an information gap that motivates click-through" },
  { name: "specificity", label: "Specificity", description: "Uses concrete details, numbers, or precise claims" },
  { name: "emotionalImpact", label: "Emotional Impact", description: "Triggers an emotional response through word choice" },
  { name: "clarity", label: "Clarity", description: "Core message is immediately understandable" },
  { name: "length", label: "Length", description: "Title length in an attention-friendly range" },
  { name: "format", label: "Format", description: "Structure and framing (e.g. listicle, question)" },
];

function buildSignalsFromBackend(score: number, explanations: BackendExplanation[]): SignalScore[] {
  const byFactor: Record<string, number> = {};
  explanations.forEach((e) => {
    const key = e.factor === "curiosity" ? "curiosityGap" : e.factor === "specificity" ? "specificity" : e.factor;
    if (e.direction === "positive") byFactor[key] = Math.min(95, score + (e.impact ?? 0) * 100);
    else if (e.direction === "negative") byFactor[key] = Math.max(20, score - 15);
    else byFactor[key] = score;
  });
  return SIGNAL_DEFS.map((d) => ({
    ...d,
    score: Math.round(byFactor[d.name] ?? score),
  }));
}

function mapBackendToAnalysisResult(
  title: string,
  platform: Platform | null,
  r: BackendPredictionResponse
): AnalysisResult {
  const confidencePct = Math.round(r.confidence * 100);
  const drivers = r.explanations.filter((e) => e.direction === "positive").map((e) => e.description);
  const weaknesses = r.explanations.filter((e) => e.direction === "negative").map((e) => e.description);
  const suggestions = r.recommendations.map((rec) => rec.message);
  const signals = buildSignalsFromBackend(r.score, r.explanations);
  return {
    id: `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    platform,
    overallScore: Math.round(r.score),
    confidence: confidencePct,
    signals,
    drivers,
    weaknesses,
    suggestions,
    predictedCTR: +(r.score / 12).toFixed(1),
    predictedEngagement: Math.round(r.score),
    timestamp: new Date().toISOString(),
  };
}

/** Convert blob URL to base64 data URL for backend */
async function urlToBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// --- API functions -----------------------------------------------------------

export async function analyzeContent(req: AnalyzeRequest): Promise<AnalysisResult> {
  const text = req.title.trim();
  if (!text) throw new ApiError(400, "Title is required");

  let endpoint = "/predict/text";
  let body: Record<string, unknown> = { text, platform: req.platform ?? null, content_type: "title" };

  const thumbnailBase64 = req.thumbnailUrl ? await urlToBase64(req.thumbnailUrl) : null;
  if (thumbnailBase64) {
    endpoint = "/predict/multimodal";
    body = { text, image_base64: thumbnailBase64, platform: req.platform ?? null, content_type: "title" };
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  const data: BackendPredictionResponse = await res.json();
  return mapBackendToAnalysisResult(req.title, req.platform ?? null, data);
}

export async function compareTitles(req: CompareRequest): Promise<CompareResult> {
  const titles = req.titles.filter((t) => t.trim());
  if (titles.length < 2) throw new ApiError(400, "At least 2 titles required");

  const candidates = titles.map((t, i) => ({ id: `c${i + 1}`, text: t.trim() }));
  const res = await fetch(`${API_BASE}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      candidates,
      platform: req.platform ?? null,
      content_type: "title",
    }),
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  const data: BackendCompareResponse = await res.json();

  const titleById: Record<string, string> = {};
  titles.forEach((t, i) => { titleById[`c${i + 1}`] = t.trim(); });

  const bestScore = data.ranked[0]?.score ?? 0;
  const ranked: RankedItem[] = data.ranked.map((r) => ({
    rank: r.rank,
    result: mapBackendToAnalysisResult(titleById[r.id] ?? r.id, req.platform ?? null, {
      score: r.score,
      bucket: r.bucket,
      confidence: r.confidence,
      explanations: r.explanations,
      recommendations: r.recommendations,
      model_used: data.model_used,
    }),
    deltaFromBest: Math.round(bestScore - r.score),
  }));

  return {
    ranked,
    reasoning: data.summary ?? `Top pick: "${ranked[0]?.result.title}" with score ${ranked[0]?.result.overallScore}.`,
    timestamp: new Date().toISOString(),
  };
}

// --- Display utilities -------------------------------------------------------

export function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  if (score >= 35) return "Needs Work";
  return "Poor";
}

export function getScoreColor(score: number): string {
  if (score >= 85) return "text-chart-excellent";
  if (score >= 70) return "text-chart-good";
  if (score >= 50) return "text-chart-average";
  if (score >= 35) return "text-chart-poor";
  return "text-chart-bad";
}

export function getScoreBgColor(score: number): string {
  if (score >= 85) return "bg-chart-excellent";
  if (score >= 70) return "bg-chart-good";
  if (score >= 50) return "bg-chart-average";
  if (score >= 35) return "bg-chart-poor";
  return "bg-chart-bad";
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 90) return "High";
  if (confidence >= 75) return "Moderate";
  return "Low";
}
