import airportsData from "@/data/airports.json";

export type Airport = {
  city: string;
  airport: string;
  iata: string;
  country: string;
  countryCode?: string;
};

export const AIRPORTS: Airport[] = airportsData as Airport[];

const BY_IATA: Map<string, Airport> = new Map(
  AIRPORTS.map((a) => [a.iata.toUpperCase(), a])
);

export function getAirportByIata(code: string): Airport | undefined {
  return BY_IATA.get(code.toUpperCase());
}

function scoreAirport(a: Airport, q: string): number {
  const query = q.trim().toLowerCase();
  const iata = (a.iata || "").toLowerCase();
  const city = (a.city || "").toLowerCase();
  const name = (a.airport || "").toLowerCase();
  const country = (a.country || "").toLowerCase();

  if (iata === query) return 1000;
  if (iata.startsWith(query)) return 900;
  if (city === query) return 800;
  if (city.startsWith(query)) return 700;
  if (name.startsWith(query)) return 600;
  if (country.startsWith(query)) return 500;
  if (iata.includes(query)) return 400;
  if (city.includes(query)) return 300;
  if (name.includes(query)) return 200;
  if (country.includes(query)) return 100;
  return 0;
}

/**
 * Search airports by city, airport name, IATA code, or country.
 * Scores every airport first, then sorts by score and returns at most `limit` results.
 */
export function searchAirports(query: string, limit = 20): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 1) return [];

  return AIRPORTS.map((a, index) => ({ ...a, _score: scoreAirport(a, q), _index: index }))
    .filter((a) => a._score > 0)
    .sort((a, b) => b._score - a._score || a._index - b._index)
    .slice(0, limit)
    .map(({ _score, _index, ...airport }) => airport);
}

export function formatAirport(a: Airport): string {
  const short =
    a.airport.replace(new RegExp(`^${escapeRegex(a.city)}\\s*`, "i"), "").trim() ||
    a.airport;
  return `${a.city} — ${short} (${a.iata})`;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
