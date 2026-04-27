export type Airport = {
  city: string;
  airport: string;
  iata: string;
  country: string;
};

export const AIRPORTS: Airport[] = [
  { city: "Amsterdam", airport: "Amsterdam Schiphol", iata: "AMS", country: "Netherlands" },
  { city: "Lisbon", airport: "Humberto Delgado Airport", iata: "LIS", country: "Portugal" },
  { city: "New York", airport: "John F. Kennedy International", iata: "JFK", country: "United States" },
  { city: "London", airport: "Heathrow", iata: "LHR", country: "United Kingdom" },
  { city: "Paris", airport: "Charles de Gaulle", iata: "CDG", country: "France" },
  { city: "Istanbul", airport: "Istanbul Airport", iata: "IST", country: "Turkey" },
  { city: "Dubai", airport: "Dubai International", iata: "DXB", country: "United Arab Emirates" },
  { city: "Delhi", airport: "Indira Gandhi International", iata: "DEL", country: "India" },
  { city: "Mumbai", airport: "Chhatrapati Shivaji Maharaj International", iata: "BOM", country: "India" },
  { city: "Bangkok", airport: "Suvarnabhumi", iata: "BKK", country: "Thailand" },
];

export function searchAirports(query: string): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return AIRPORTS;
  return AIRPORTS.filter((a) =>
    [a.city, a.airport, a.iata, a.country].some((f) => f.toLowerCase().includes(q))
  );
}

export function formatAirport(a: Airport): string {
  // Short airport label, e.g. "Schiphol" from "Amsterdam Schiphol"
  const short = a.airport.replace(new RegExp(`^${a.city}\\s*`, "i"), "").trim() || a.airport;
  return `${a.city} — ${short} (${a.iata})`;
}
