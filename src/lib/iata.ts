// Minimal, safe city → IATA map for Phase 76 Quick Search.
// Only converts when we know it. Otherwise the user input is preserved as-is.

const CITY_TO_IATA: Record<string, string> = {
  amsterdam: "AMS",
  lisbon: "LIS",
  "new york": "JFK",
  london: "LHR",
  paris: "CDG",
};

export function toIataIfKnown(input: string): string {
  const raw = input.trim();
  if (!raw) return raw;
  // If it already looks like a 3-letter IATA code, keep as-is uppercased.
  if (/^[A-Za-z]{3}$/.test(raw)) return raw.toUpperCase();
  const key = raw.toLowerCase();
  return CITY_TO_IATA[key] ?? raw;
}
