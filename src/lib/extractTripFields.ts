// Lightweight, frontend-only natural language field extractor.
// Pulls best-effort hints out of the user's prompt so we can send a structured
// payload to POST /search alongside the raw text. The backend remains the
// source of truth — this is just a starter shape.

export type ExtractedTripFields = {
  prompt: string;
  from?: string;
  to?: string;
  departDate?: string; // ISO yyyy-mm-dd
  returnDate?: string; // ISO yyyy-mm-dd
  travelers?: { adults: number; children: number };
};

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
};

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const toIso = (d: Date) => d.toISOString().slice(0, 10);

const nextWeekday = (base: Date, weekday: number, allowToday = false): Date => {
  const d = new Date(base);
  const diff = (weekday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + (diff === 0 && !allowToday ? 7 : diff));
  return d;
};

const parseDateTokens = (text: string, base = new Date()): { depart?: string; ret?: string } => {
  const lower = text.toLowerCase();
  let depart: Date | undefined;
  let ret: Date | undefined;

  // ISO dates yyyy-mm-dd
  const isoMatches = lower.match(/\b(20\d{2}-\d{2}-\d{2})\b/g);
  if (isoMatches?.length) {
    depart = new Date(isoMatches[0]);
    if (isoMatches[1]) ret = new Date(isoMatches[1]);
  }

  // "next <weekday>" / "this <weekday>"
  if (!depart) {
    const m = lower.match(/\b(next|this)\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);
    if (m) depart = nextWeekday(base, WEEKDAYS.indexOf(m[2]));
  }

  // "return <weekday>" / "back <weekday>"
  if (depart && !ret) {
    const m = lower.match(/\b(return|back|coming back)\s+(?:on\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);
    if (m) ret = nextWeekday(depart, WEEKDAYS.indexOf(m[2]), true);
  }

  // "in <month>" → first of month
  if (!depart) {
    const m = lower.match(/\bin\s+([a-z]+)\b/);
    if (m && MONTHS[m[1]] !== undefined) {
      const month = MONTHS[m[1]];
      const year = month < base.getMonth() ? base.getFullYear() + 1 : base.getFullYear();
      depart = new Date(year, month, 1);
    }
  }

  return { depart: depart ? toIso(depart) : undefined, ret: ret ? toIso(ret) : undefined };
};

const parseTravelers = (text: string): { adults: number; children: number } | undefined => {
  const lower = text.toLowerCase();
  const adultsMatch = lower.match(/(\d+)\s+adults?/);
  const childrenMatch = lower.match(/(\d+)\s+(?:kids?|children|child)/);
  const familyMatch = /\bfamily\b/.test(lower);
  if (!adultsMatch && !childrenMatch && !familyMatch) return undefined;
  return {
    adults: adultsMatch ? parseInt(adultsMatch[1], 10) : familyMatch ? 2 : 1,
    children: childrenMatch ? parseInt(childrenMatch[1], 10) : familyMatch ? 2 : 0,
  };
};

const parseFromTo = (text: string): { from?: string; to?: string } => {
  // "from X to Y" — capture words until a date/keyword break
  const m = text.match(/from\s+([A-Z][\w .'-]*?)\s+to\s+([A-Z][\w .'-]*?)(?=[,.\n]|\s+(?:next|this|in|on|for|with|under|around|by|—|-)|\s*$)/i);
  if (m) return { from: m[1].trim(), to: m[2].trim() };

  // "to X" only
  const t = text.match(/\bto\s+([A-Z][\w .'-]*?)(?=[,.\n]|\s+(?:next|this|in|on|for|with|under|around|by)|\s*$)/);
  if (t) return { to: t[1].trim() };

  return {};
};

export function extractTripFields(prompt: string): ExtractedTripFields {
  const text = prompt.trim();
  const { from, to } = parseFromTo(text);
  const { depart, ret } = parseDateTokens(text);
  const travelers = parseTravelers(text);
  return {
    prompt: text,
    from,
    to,
    departDate: depart,
    returnDate: ret,
    travelers,
  };
}
