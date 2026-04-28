// Travixis frontend API client.
// Backend lives at NEXT_PUBLIC_API_BASE_URL (Render). In Vite we read VITE_API_BASE_URL,
// falling back to the documented Render URL so the app works out of the box.

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "https://travixis-api.onrender.com";

export const API_BASE_URL = BASE_URL;

export type HealthResponse = { status: string; [k: string]: unknown };
export type DbHealthResponse = { status: string; [k: string]: unknown };

// Canonical trip request snapshot echoed by GET /search/:id.
// Source of truth for every page that renders trip context.
export type SearchRequestSnapshot = {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  travelers: number;
  createdAt: string;
};

export type SearchOptionFromBackend = {
  id?: string | number;
  type?: string;
  price?: number;
  currency?: string;
  riskScore?: number;
  durationMinutes?: number;
  airline?: string;
  carrier?: string;
  carrierIataCode?: string;
  explanation?: {
    summary?: string;
    priceBreakdown?: {
      baseFare?: number;
      taxes?: number;
      baggage?: number;
      fees?: number;
    };
    riskFactors?: string[];
  };
  // Tolerated legacy fields.
  airline_name?: string;
  route?: string;
  origin?: string;
  destination?: string;
  durationText?: string;
  duration?: string;
  stops?: number | string;
  baggage?: number;
  fees?: number;
  taxes?: number;
};

export type SearchResponse = {
  searchId: string;
  request: SearchRequestSnapshot | null;
  status?: string;
  progress?: number;
  step?: string | number;
  updates?: string[];
  source?: "duffel" | "fallback";
  results?: { options?: SearchOptionFromBackend[] };
  // Tolerated legacy/alternate shapes.
  options?: SearchOptionFromBackend[];
  recommendations?: SearchOptionFromBackend[];
  search?: { options?: SearchOptionFromBackend[] };
};

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    init?.timeoutMs ?? 8000
  );
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new ApiError(res.status, `Request failed: ${res.status}`);
    }
    // Some health endpoints may return text — try json first.
    const text = await res.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      return { status: text } as unknown as T;
    }
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  // Health
  health: () => request<HealthResponse>("/healthz"),
  dbHealth: () => request<DbHealthResponse>("/db/health"),

  // Future endpoint placeholders — wired but not yet called from UI.
  search: (payload: unknown) =>
    request<{ searchId?: string; id?: string }>("/search", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getSearch: (id: string) => request<SearchResponse>(`/search/${id}`),
  getTrip: (id: string) => request<unknown>(`/trips/${id}`),
};

export { ApiError };
