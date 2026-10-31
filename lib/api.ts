import type { ClinicalData, ProcessResponse, SummaryResponse } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api${path}`, options);
  } catch {
    throw new Error("Could not reach AarogyaNote. Check that the API server is running.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function processAudio(file: File): Promise<ProcessResponse> {
  const data = new FormData();
  data.append("file", file);
  return request<ProcessResponse>("/process", { method: "POST", body: data });
}

export function generateSummary(clinicalData: ClinicalData): Promise<SummaryResponse> {
  return request<SummaryResponse>("/generate-summary", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clinical_data: clinicalData })
  });
}
