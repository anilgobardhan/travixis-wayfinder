// ============================================================================
// Connected Intelligence Engine
// Generates contextual cross-module insights by reading the trip, wallet, and
// user-profile entities together. Pure functions — no side effects, no UI.
// Surfaces consume the resulting IntelligenceEvent[] via <ConnectedInsights/>.
// ============================================================================

import {
  IntelligenceEvent,
  Trip,
  User,
  WalletAccount,
  totalWalletBalance,
} from "./travel-os";

const nowIso = () => new Date().toISOString();

// Lightweight ID — stable across re-renders within the same logical insight.
const id = (prefix: string, key: string) => `${prefix}_${key.replace(/\W+/g, "_").toLowerCase()}`;

const hourOfDay = () => new Date().getHours();

// ─── Wallet ↔ Trip ────────────────────────────────────────────────────────
export const walletTripInsights = (
  trip: Trip,
  wallet: WalletAccount[],
): IntelligenceEvent[] => {
  const out: IntelligenceEvent[] = [];
  const remaining = (trip.budget?.allocated ?? 0) - (trip.budget?.spent ?? 0);
  const balance = totalWalletBalance(wallet);
  const hotels = wallet.find((a) => a.category === "hotels")?.balance ?? 0;
  const shared = wallet.find((a) => a.category === "shared")?.balance ?? 0;
  const refund = wallet.find((a) => a.category === "refund")?.balance ?? 0;

  if (hotels >= remaining * 0.6 && remaining > 0) {
    out.push({
      id: id("wt", `hotels-cover-${trip.id}`),
      source: "wallet",
      severity: "positive",
      title: "Wallet can cover most of your stay",
      body: `Your hotel balance (€${hotels}) covers ~${Math.min(100, Math.round((hotels / Math.max(remaining, 1)) * 100))}% of your remaining ${trip.title} budget.`,
      tripId: trip.id,
      occurredAt: nowIso(),
      action: { label: "Allocate to trip", href: "/wallet" },
    });
  }

  if (shared > 0) {
    out.push({
      id: id("wt", `shared-${trip.id}`),
      source: "wallet",
      severity: "info",
      title: "Shared funding available",
      body: `€${shared} of pooled funds can be applied to ${trip.title} to reduce your remaining balance.`,
      tripId: trip.id,
      occurredAt: nowIso(),
      action: { label: "Apply shared funds", href: "/wallet" },
    });
  }

  if (refund > 0) {
    out.push({
      id: id("wt", `refund-${trip.id}`),
      source: "wallet",
      severity: "positive",
      title: "Refund credit available",
      body: `€${refund} fare-drop credit on file — applies automatically to your next booking.`,
      tripId: trip.id,
      occurredAt: nowIso(),
    });
  }

  if (balance < remaining * 0.2 && remaining > 0) {
    out.push({
      id: id("wt", `low-${trip.id}`),
      source: "wallet",
      severity: "watch",
      title: "Wallet coverage is light",
      body: "Consider opening a shared funding pool — splitting this trip is one tap away.",
      tripId: trip.id,
      occurredAt: nowIso(),
      action: { label: "Open shared funding", href: "/wallet" },
    });
  }

  return out;
};

// ─── Profile ↔ Results ────────────────────────────────────────────────────
export const profileResultsInsights = (user: User): IntelligenceEvent[] => {
  const out: IntelligenceEvent[] = [];
  if (user.preferences.seat !== "any") {
    out.push({
      id: id("pr", `seat-${user.preferences.seat}`),
      source: "profile",
      severity: "info",
      title: `${user.preferences.seat === "window" ? "Window" : "Aisle"} seats prioritized`,
      body: `Travixis ranks routes that match your ${user.preferences.seat}-seat preference.`,
      occurredAt: nowIso(),
    });
  }
  if (user.preferences.minTransferMinutes >= 60) {
    out.push({
      id: id("pr", `transfer-${user.preferences.minTransferMinutes}`),
      source: "profile",
      severity: "info",
      title: "Tight transfers de-prioritized",
      body: `Itineraries with under ${user.preferences.minTransferMinutes} min transfers are filtered down based on your history.`,
      occurredAt: nowIso(),
    });
  }
  if (user.preferences.avoidRedEye) {
    out.push({
      id: id("pr", "avoid-redeye"),
      source: "profile",
      severity: "info",
      title: "Red-eye routes softened",
      body: "Overnight options are still visible but ranked lower for sleep quality.",
      occurredAt: nowIso(),
    });
  }
  return out;
};

// ─── Trip operational signals ─────────────────────────────────────────────
export const tripOperationalInsights = (trip: Trip): IntelligenceEvent[] => {
  const out: IntelligenceEvent[] = [];
  const seg = trip.bookings[0]?.segments[0];
  if (!seg) return out;

  if (trip.disruptionRisk <= 20) {
    out.push({
      id: id("op", `low-disruption-${seg.id}`),
      source: "schedule",
      severity: "positive",
      title: "Historically smoother arrival",
      body: `${seg.carrier} ${seg.number} runs ${seg.onTimeScore}% on-time on this corridor — disruption risk steady at ${trip.disruptionRisk}%.`,
      tripId: trip.id,
      occurredAt: nowIso(),
    });
  }
  if (trip.weatherConfidence >= 75) {
    out.push({
      id: id("op", `weather-${seg.id}`),
      source: "weather",
      severity: "positive",
      title: "Weather confidence improving",
      body: `${seg.to.city} arrival window holds clear with ${trip.weatherConfidence}% confidence.`,
      tripId: trip.id,
      occurredAt: nowIso(),
    });
  }
  if (seg.gatePredicted && seg.gate) {
    out.push({
      id: id("op", `gate-${seg.id}`),
      source: "airport",
      severity: "info",
      title: "Predicted gate ready",
      body: `${seg.from.code} ${seg.from.terminal ?? ""} · gate ${seg.gate} (predicted). Final gate confirms ~2h before boarding.`,
      tripId: trip.id,
      occurredAt: nowIso(),
    });
  }

  // Time-aware morning / evening framing.
  const h = hourOfDay();
  if (h < 11) {
    out.push({
      id: id("op", `morning-${trip.id}`),
      source: "airport",
      severity: "positive",
      title: "Security pressure currently low",
      body: `${seg.from.code} security wait ~12 min — a calmer departure window.`,
      tripId: trip.id,
      occurredAt: nowIso(),
    });
  } else if (h >= 18) {
    out.push({
      id: id("op", `evening-${trip.id}`),
      source: "weather",
      severity: "positive",
      title: "Disruption risk dropped overnight",
      body: "Forecast volatility eased over the past 6 hours.",
      tripId: trip.id,
      occurredAt: nowIso(),
    });
  }

  return out;
};

// ─── Aggregator ───────────────────────────────────────────────────────────
export const generateInsights = (input: {
  user: User;
  trip: Trip;
  wallet: WalletAccount[];
  scope?: ("wallet" | "profile" | "operational")[];
}): IntelligenceEvent[] => {
  const scope = input.scope ?? ["wallet", "profile", "operational"];
  const out: IntelligenceEvent[] = [];
  if (scope.includes("operational")) out.push(...tripOperationalInsights(input.trip));
  if (scope.includes("wallet")) out.push(...walletTripInsights(input.trip, input.wallet));
  if (scope.includes("profile")) out.push(...profileResultsInsights(input.user));
  return out;
};
