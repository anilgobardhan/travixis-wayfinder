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

/**
 * Search airports by city, airport name, IATA code, or country.
 * Performance:
 *  - Returns at most `limit` results (default 20).
 *  - Prioritizes exact IATA match, then IATA prefix, then city startsWith,
 *    then any substring match.
 */
export function searchAirports(query: string, limit = 20): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    // No query: just return the first N (alphabetical by country/city).
    return AIRPORTS.slice(0, limit);
  }

  const exactIata: Airport[] = [];
  const iataPrefix: Airport[] = [];
  const cityStarts: Airport[] = [];
  const other: Airport[] = [];

  const total = AIRPORTS.length;
  const cap = limit * 4; // early-exit ceiling for very common substrings

  for (let i = 0; i < total; i++) {
    const a = AIRPORTS[i];
    const iata = a.iata.toLowerCase();
    const city = a.city.toLowerCase();
    const name = a.airport.toLowerCase();
    const country = a.country.toLowerCase();

    if (iata === q) {
      exactIata.push(a);
    } else if (iata.startsWith(q)) {
      iataPrefix.push(a);
    } else if (city.startsWith(q)) {
      cityStarts.push(a);
    } else if (
      city.includes(q) ||
      name.includes(q) ||
      country.includes(q) ||
      iata.includes(q)
    ) {
      other.push(a);
    }

    if (
      exactIata.length + iataPrefix.length + cityStarts.length + other.length >=
      cap
    ) {
      break;
    }
  }

  return [...exactIata, ...iataPrefix, ...cityStarts, ...other].slice(0, limit);
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
