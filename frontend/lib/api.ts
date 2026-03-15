/**
 * Client for AttentionLens API.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type ExplanationItem = {
  factor: string;
  direction: string;
  description: string;
  impact?: number;
};

export type RecommendationItem = {
  type: string;
  message: string;
  priority: string;
};

export type PredictionResponse = {
  score: number;
  bucket: string;
  confidence: number;
  explanations: ExplanationItem[];
  recommendations: RecommendationItem[];
  model_used: string;
  feature_summary?: Record<string, unknown>;
};

export type CompareCandidate = {
  id: string;
  text?: string;
  image_base64?: string;
  image_url?: string;
};

export type RankedCandidate = {
  id: string;
  rank: number;
  score: number;
  bucket: string;
  confidence: number;
  explanations: ExplanationItem[];
  recommendations: RecommendationItem[];
};

export type CompareResponse = {
  ranked: RankedCandidate[];
  model_used: string;
  summary?: string;
};

async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function predictText(
  text: string,
  platform?: string,
  contentType?: string
): Promise<PredictionResponse> {
  return fetchApi<PredictionResponse>("/predict/text", {
    method: "POST",
    body: JSON.stringify({
      text,
      platform: platform || null,
      content_type: contentType || null,
    }),
  });
}

export async function predictImage(
  imageBase64?: string,
  imageUrl?: string,
  platform?: string,
  contentType?: string
): Promise<PredictionResponse> {
  return fetchApi<PredictionResponse>("/predict/image", {
    method: "POST",
    body: JSON.stringify({
      image_base64: imageBase64 || null,
      image_url: imageUrl || null,
      platform: platform || null,
      content_type: contentType || null,
    }),
  });
}

export async function predictMultimodal(
  text: string,
  imageBase64?: string,
  imageUrl?: string,
  platform?: string,
  contentType?: string
): Promise<PredictionResponse> {
  return fetchApi<PredictionResponse>("/predict/multimodal", {
    method: "POST",
    body: JSON.stringify({
      text,
      image_base64: imageBase64 || null,
      image_url: imageUrl || null,
      platform: platform || null,
      content_type: contentType || null,
    }),
  });
}

export async function compareCandidates(
  candidates: CompareCandidate[],
  platform?: string,
  contentType?: string
): Promise<CompareResponse> {
  return fetchApi<CompareResponse>("/compare", {
    method: "POST",
    body: JSON.stringify({
      candidates,
      platform: platform || null,
      content_type: contentType || null,
    }),
  });
}

export async function getModelInfo(): Promise<{
  mock: boolean;
  models: Record<string, string>;
  description: string;
}> {
  return fetchApi("/model/info");
}
