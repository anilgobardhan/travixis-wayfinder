// Feature flags for Travixis frontend.
// Reads from Vite env at build time. All flags should be safe to default OFF.

export const ENABLE_REAL_SEARCH =
  (import.meta.env.VITE_ENABLE_REAL_SEARCH as string | undefined) === "true";
