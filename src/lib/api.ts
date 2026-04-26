// Travixis frontend API client.
// Backend lives at NEXT_PUBLIC_API_BASE_URL (Render). In Vite we read VITE_API_BASE_URL,
// falling back to the documented Render URL so the app works out of the box.

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "https://travixis-api.onrender.com";

export const API_BASE_URL = BASE_URL;

export type HealthResponse = { status: string; [k: string]: unknown };
export type DbHealthResponse = { status: string; [k: string]: unknown };

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
    request<{ id: string }>("/search", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getSearch: (id: string) => request<unknown>(`/search/${id}`),
  getTrip: (id: string) => request<unknown>(`/trips/${id}`),
};

export { ApiError };
