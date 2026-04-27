// Feature flags for Travixis frontend.
// NOTE: This project is Vite (not Next.js). Vite only exposes env vars via
// `import.meta.env.VITE_*` at build time. `process.env.NEXT_PUBLIC_*` does
// NOT exist in the browser bundle here. To enable the real backend in
// Vercel, set: VITE_ENABLE_REAL_SEARCH=true and VITE_API_BASE_URL=...
//
// Default behavior change: if no explicit flag is set but VITE_API_BASE_URL
// is configured, we treat real search as enabled. This avoids the silent
// "always offline" trap when the env flag is forgotten.

const explicit = import.meta.env.VITE_ENABLE_REAL_SEARCH as string | undefined;
const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const ENABLE_REAL_SEARCH =
  explicit === "true" || (explicit === undefined && Boolean(apiBase));
