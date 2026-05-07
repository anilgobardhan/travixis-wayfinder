import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plane,
  Clock,
  Luggage,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Info,
  Lightbulb,
  Wallet,
  Gauge,
  Wand2,
  MapPin,
  CalendarRange,
  Compass,
  Timer,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeSoft } from "@/components/BadgeSoft";
import { cn } from "@/lib/utils";
import { api, type SearchRequestSnapshot } from "@/lib/api";
import { ENABLE_REAL_SEARCH } from "@/lib/flags";
import {
  SmartFiltersBar,
  ComparisonPanel,
  ConfidenceChip,
  RiskChips,
  WhyChips,
  applySmartFilter,
  type SmartFilterKey,
} from "@/components/results/ResultsIntelligence";
import { WalletInsightsPanel, WalletAwareChip } from "@/components/wallet/WalletIntelligence";
import {
  ResultsFilters,
  MobileFiltersButton,
  ActiveFilterChips,
  defaultFlightFilters,
  type FlightFilters,
  type SearchType,
} from "@/components/results/ResultsFilters";
import { CompareDrawer, MobileResultsBar } from "@/components/results/ResultsCompareDrawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudSun, Leaf } from "lucide-react";

type SortKey = "recommended" | "price" | "stress" | "duration";

type Option = {
  id: string;
  airline: string;
  route: string;
  duration: string;
  stops: string;
  price: number;
  taxes: number;
  baggage: number;
  fees: number;
  currency: string; // e.g. "EUR"
  riskScore: number; // 0-100, lower is better
  baggageInfo: string;
  refund: string;
  why: string;
  tag?: "best-value" | "lowest-stress" | "cheapest";
};

// Backend's `explanation.riskFactors[]` carries strings like
// "direct flight", "1 layover", "2 layovers", "round trip".
// Pick the first stops-related factor and capitalize it for the UI.
const stopsFromRiskFactors = (factors?: string[]): string | undefined => {
  if (!Array.isArray(factors)) return undefined;
  for (const f of factors) {
    const lower = f.toLowerCase();
    if (lower.includes("direct")) return "Direct";
    const layover = /^(\d+)\s+layovers?$/.exec(lower);
    if (layover) {
      const n = Number(layover[1]);
      return n === 1 ? "1 stop" : `${n} stops`;
    }
  }
  return undefined;
};

// Currency code → symbol when we know it; otherwise return the code itself
// so the UI never silently lies about currency.
const currencySymbol = (code: string): string => {
  if (code === "EUR") return "€";
  if (code === "USD") return "$";
  if (code === "GBP") return "£";
  return code;
};

// Locale-aware money formatter. Always 2 decimals so live prices like
// 157.39999999999998 render as "€157.40" instead of leaking float artifacts.
const formatMoney = (amount: number, currency: string = "EUR"): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback if `currency` is not a valid ISO code.
    return `${currencySymbol(currency)}${amount.toFixed(2)}`;
  }
};

const options: Option[] = [
  {
    id: "1",
    airline: "TAP Air Portugal",
    route: "AMS → LIS",
    duration: "3h 25m",
    stops: "Direct",
    price: 218, taxes: 42, baggage: 25, fees: 0, currency: "EUR",
    riskScore: 12,
    baggageInfo: "Carry-on + 23kg checked included",
    refund: "Refundable until 24h before departure",
    why: "Direct flight, low disruption history, baggage included.",
    tag: "best-value",
  },
  {
    id: "2",
    airline: "KLM",
    route: "AMS → LIS",
    duration: "3h 35m",
    stops: "Direct",
    price: 264, taxes: 48, baggage: 0, fees: 0, currency: "EUR",
    riskScore: 8,
    baggageInfo: "Carry-on only — checked bag €35",
    refund: "Fully flexible, free changes",
    why: "Most reliable on-time record, full flexibility.",
    tag: "lowest-stress",
  },
  {
    id: "3",
    airline: "Ryanair",
    route: "AMS → LIS",
    duration: "5h 10m",
    stops: "1 stop · Madrid",
    price: 119, taxes: 28, baggage: 32, fees: 8, currency: "EUR",
    riskScore: 48,
    baggageInfo: "Small carry-on only — extras paid",
    refund: "Non-refundable",
    why: "Lowest base fare. Trade-off: longer journey, tight connection.",
    tag: "cheapest",
  },
  {
    id: "4",
    airline: "Lufthansa",
    route: "AMS → LIS",
    duration: "4h 50m",
    stops: "1 stop · Frankfurt",
    price: 289, taxes: 52, baggage: 0, fees: 0, currency: "EUR",
    riskScore: 22,
    baggageInfo: "Carry-on + 23kg checked included",
    refund: "Partial refund (€80 fee)",
    why: "Good comfort, decent reliability — but longer journey.",
  },
];

const tagMeta: Record<NonNullable<Option["tag"]>, { label: string; icon: React.ReactNode; variant: "success" | "primary" | "accent" }> = {
  "best-value": { label: "Best value", icon: <Sparkles className="h-3 w-3" />, variant: "primary" },
  "lowest-stress": { label: "Lowest stress", icon: <ShieldCheck className="h-3 w-3" />, variant: "success" },
  cheapest: { label: "Cheapest", icon: <TrendingDown className="h-3 w-3" />, variant: "accent" },
};

// Backend response shape (loose — backend is still evolving).
type BackendOption = {
  id?: string | number;
  airline?: string;
  carrier?: string;
  route?: string;
  origin?: string;
  destination?: string;
  durationMinutes?: number;
  duration?: string;
  stops?: number | string;
  price?: number;
  currency?: string;
  taxes?: number;
  baggage?: number;
  fees?: number;
  riskScore?: number;
  baggageInfo?: string;
  refund?: string;
  tag?: Option["tag"];
  type?: string;
  explanation?: {
    summary?: string;
    priceBreakdown?: { baseFare?: number; taxes?: number; baggage?: number; fees?: number };
    riskFactors?: string[];
  };
};

// Backend types are snake_cased (e.g. "best_value"); our internal Option["tag"]
// uses dashes. Map across so the recommended A/B/C section actually renders.
const tagFromType = (t?: string): Option["tag"] => {
  if (t === "best_value") return "best-value";
  if (t === "lowest_stress") return "lowest-stress";
  if (t === "cheapest") return "cheapest";
  return undefined;
};

const formatDuration = (mins?: number, fallback?: string) => {
  if (typeof mins !== "number" || !Number.isFinite(mins)) return fallback ?? "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
};

const mapBackendOption = (b: BackendOption, i: number): Option => {
  // Prefer the live riskFactors-derived stops indicator over the placeholder.
  const stopsFromBackend =
    typeof b.stops === "number"
      ? b.stops === 0
        ? "Direct"
        : `${b.stops} stop${b.stops > 1 ? "s" : ""}`
      : typeof b.stops === "string"
      ? b.stops
      : undefined;
  const stops =
    stopsFromBackend || stopsFromRiskFactors(b.explanation?.riskFactors) || "—";
  const route =
    b.route || (b.origin && b.destination ? `${b.origin} → ${b.destination}` : "—");
  const breakdown = b.explanation?.priceBreakdown ?? {};
  // Backend's `price` is the TOTAL; the UI re-totals price+taxes+baggage+fees,
  // so use the breakdown's baseFare when present to avoid double-counting.
  const basePrice =
    typeof breakdown.baseFare === "number"
      ? breakdown.baseFare
      : typeof b.price === "number"
      ? b.price
      : 0;
  // Backend ships riskScore in 0–1; the UI thresholds at 0–100. Scale up.
  const rawRisk = typeof b.riskScore === "number" ? b.riskScore : 0.25;
  const riskScore = rawRisk <= 1 ? Math.round(rawRisk * 100) : Math.round(rawRisk);
  const baggageAmount =
    typeof breakdown.baggage === "number"
      ? breakdown.baggage
      : typeof b.baggage === "number"
      ? b.baggage
      : 0;
  // Derive baggageInfo from the numeric amount when no explicit string came back.
  const currency = typeof b.currency === "string" && b.currency.length > 0 ? b.currency : "EUR";
  const sym = currencySymbol(currency);
  const derivedBaggageInfo =
    baggageAmount > 0
      ? `Baggage included (${sym}${baggageAmount})`
      : "Baggage not included";
  return {
    id: String(b.id ?? i + 1),
    airline: b.airline || b.carrier || "Travel option",
    route,
    duration: formatDuration(b.durationMinutes, b.duration),
    stops,
    price: basePrice,
    taxes: typeof breakdown.taxes === "number" ? breakdown.taxes : typeof b.taxes === "number" ? b.taxes : 0,
    baggage: baggageAmount,
    fees: typeof b.fees === "number" ? b.fees : breakdown.fees ?? 0,
    currency,
    riskScore,
    baggageInfo: b.baggageInfo || derivedBaggageInfo,
    refund: b.refund || "Refund policy on confirmation",
    why: b.explanation?.summary || "Recommended by Travixis based on your goal.",
    tag: b.tag ?? tagFromType(b.type),
  };
};

// Lightweight date formatter — "2026-04-15" -> "15 Apr". Returns "" on
// invalid/missing input so an empty trip summary collapses cleanly.
const formatTripDate = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

const ResultsPage = () => {
  const [compare, setCompare] = useState<string[]>([]);
  const [smartFilter, setSmartFilter] = useState<SmartFilterKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("recommended");
  const [compareOpen, setCompareOpen] = useState(false);
  const [params] = useSearchParams();
  const fromAutopilot = params.get("from") === "autopilot";
  const searchId = params.get("id") || undefined;
  const searchType = ((params.get("type") as SearchType) || "flights") as SearchType;

  // Trip context comes ONLY from the backend's request snapshot now —
  // no URL-param fallbacks, no mocks. If the snapshot is missing the
  // page renders an empty trip badge rather than fake data.
  const [tripRequest, setTripRequest] = useState<SearchRequestSnapshot | null>(null);
  const [liveOptions, setLiveOptions] = useState<Option[] | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    console.log("RESULTS SEARCH ID", searchId);
    if (!searchId) {
      setTripRequest(null);
      setPreviewMode(true);
      return;
    }
    if (!ENABLE_REAL_SEARCH) {
      setTripRequest(null);
      setPreviewMode(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getSearch(searchId);
        console.log("RESULTS API DATA", data);
        if (cancelled) return;
        setTripRequest(data?.request ?? null);
        const raw =
          data?.results?.options ??
          data?.options ??
          data?.recommendations ??
          data?.search?.options ??
          [];
        const mapped = (raw as BackendOption[]).map(mapBackendOption);
        if (mapped.length > 0) {
          setLiveOptions(mapped);
          setPreviewMode(false);
        } else {
          setLiveOptions(null);
          setPreviewMode(true);
        }
      } catch (error) {
        console.error("RESULTS FETCH FAILED", error);
        if (cancelled) return;
        setTripRequest(null);
        setLiveOptions(null);
        setPreviewMode(true);
        toast.warning("Backend unreachable — showing preview results.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchId, fromAutopilot]);

  // Once live options arrive, the mock `options` array MUST not be used.
  const baseOptions = liveOptions && liveOptions.length > 0 ? liveOptions : options;

  // Derive filter facets from current base options
  const priceMin = Math.max(0, Math.floor(Math.min(...baseOptions.map((o) => o.price + o.taxes + o.baggage + o.fees))));
  const priceMax = Math.ceil(Math.max(...baseOptions.map((o) => o.price + o.taxes + o.baggage + o.fees), priceMin + 100));
  const airlineList = Array.from(new Set(baseOptions.map((o) => o.airline))).sort();
  const defaults = defaultFlightFilters(priceMax);
  const [filters, setFilters] = useState<FlightFilters>(defaults);
  // Re-baseline maxPrice when result set changes
  useEffect(() => {
    setFilters((f) => (f.maxPrice > priceMax || f.maxPrice === 0 ? { ...f, maxPrice: priceMax } : f));
  }, [priceMax]);

  const matchStops = (stops: string, selected: string[]) => {
    if (selected.length === 0) return true;
    const s = stops.toLowerCase();
    return selected.some((sel) => {
      if (sel === "Direct") return s.startsWith("direct");
      if (sel === "1 stop") return s.startsWith("1 stop");
      if (sel === "2+ stops") return /^([2-9]|\d{2,})\s+stops?/.test(s);
      return false;
    });
  };

  const refinedOptions = baseOptions.filter((o) => {
    const total = o.price + o.taxes + o.baggage + o.fees;
    if (total > filters.maxPrice) return false;
    if (!matchStops(o.stops, filters.stops)) return false;
    if (filters.airlines.length > 0 && !filters.airlines.includes(o.airline)) return false;
    if (filters.baggageIncluded && o.baggage <= 0 && !/included/i.test(o.baggageInfo)) return false;
    if (filters.refundableOnly && !/refundable|flexible|free changes/i.test(o.refund)) return false;
    if (filters.lowStressOnly && o.riskScore >= 20) return false;
    return true;
  });

  const filtered = applySmartFilter(refinedOptions, smartFilter);
  const sortFn: Record<SortKey, (a: Option, b: Option) => number> = {
    recommended: () => 0,
    price: (a, b) => (a.price + a.taxes + a.baggage + a.fees) - (b.price + b.taxes + b.baggage + b.fees),
    stress: (a, b) => a.riskScore - b.riskScore,
    duration: (a, b) => a.duration.localeCompare(b.duration),
  };
  const displayOptions = [...filtered].sort(sortFn[sortKey]);
  const recommended = displayOptions.filter((o) => o.tag);
  const compareOptions = baseOptions.filter((o) => compare.includes(o.id));

  console.log("RESULTS_RENDER_SOURCE", {
    searchId,
    liveOptionsCount: liveOptions?.length ?? 0,
    previewMode,
  });

  // Trip summary text comes from the backend snapshot only.
  const summaryRoute =
    tripRequest && tripRequest.from && tripRequest.to
      ? `${tripRequest.from.toUpperCase()} → ${tripRequest.to.toUpperCase()}`
      : "";
  const summaryDates = (() => {
    const a = tripRequest ? formatTripDate(tripRequest.departDate) : "";
    const b = tripRequest ? formatTripDate(tripRequest.returnDate) : "";
    if (a && b) return `${a}–${b}`;
    if (a) return a;
    return "";
  })();
  const summaryTravelers =
    tripRequest && typeof tripRequest.travelers === "number" && tripRequest.travelers >= 1
      ? `${tripRequest.travelers} ${tripRequest.travelers === 1 ? "traveler" : "travelers"}`
      : "";
  const tripSummary = [summaryRoute, summaryDates, summaryTravelers].filter(Boolean).join(" · ");

  const filterProps = {
    searchType,
    airlines: airlineList,
    priceMin,
    priceMax,
    filters,
    onChange: setFilters,
    onClear: () => setFilters(defaultFlightFilters(priceMax)),
    resultCount: displayOptions.length,
  };

  return (
    <div className="container max-w-7xl pb-24 lg:pb-0">
      <MobileFiltersButton {...filterProps} />
      <div className="flex gap-8 items-start">
        <ResultsFilters {...filterProps} />
        <div className="flex-1 min-w-0 space-y-10">
          <ActiveFilterChips
            filters={filters}
            defaults={defaults}
            onChange={setFilters}
            onClear={() => setFilters(defaultFlightFilters(priceMax))}
          />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {fromAutopilot && (
            <BadgeSoft variant="accent" className="mb-2"><Wand2 className="h-3 w-3" /> Smart Search result</BadgeSoft>
          )}
          {tripSummary && (
            <BadgeSoft variant="primary">{tripSummary}</BadgeSoft>
          )}
          <h1 className="mt-3 text-3xl font-bold">{displayOptions.length} options found</h1>
          <p className="mt-1 text-muted-foreground">Sorted by Travixis recommendation. All prices include taxes & surcharges.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/search">Edit search</Link></Button>
          <Button variant="ghost" onClick={() => toast.info("Keep searching — Travixis will refine alternatives.")}>
            Keep searching
          </Button>
        </div>
      </div>

      {previewMode && (
        <div className="flex items-start gap-2 rounded-xl border border-[hsl(var(--warning))]/30 bg-[hsl(var(--accent-soft))] px-4 py-3 text-sm text-foreground">
          <AlertTriangle className="h-4 w-4 mt-0.5 text-[hsl(var(--warning))]" />
          <span>
            Running in <strong>preview mode</strong> — showing illustrative results until the live search is available.
          </span>
        </div>
      )}

      {/* A/B/C recommendation block */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Travixis recommends</h2>
        <div className="mt-3 grid md:grid-cols-3 gap-4">
          {recommended.map((o) => {
            const meta = tagMeta[o.tag!];
            const total = o.price + o.taxes + o.baggage + o.fees;
            return (
              <div key={o.id} className="rounded-2xl border bg-card p-5 shadow-card flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <BadgeSoft variant={meta.variant}>{meta.icon}{meta.label}</BadgeSoft>
                  <ConfidenceChip option={o} />
                </div>
                <p className="mt-3 font-semibold">{o.airline}</p>
                <p className="text-xs text-muted-foreground">{o.route} · {o.stops} · {o.duration}</p>
                <p className="mt-3 text-2xl font-bold">{formatMoney(total, o.currency)}</p>
                <p className="text-xs text-muted-foreground">true total price</p>
                <div className="mt-3"><RiskChips option={o} /></div>
                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-start gap-1.5"><Luggage className="h-3 w-3 mt-0.5 shrink-0" /> {o.baggageInfo}</li>
                  <li className="flex items-start gap-1.5"><ShieldCheck className="h-3 w-3 mt-0.5 shrink-0" /> {o.refund}</li>
                </ul>
                <div className="mt-3"><WhyChips option={o} /></div>
                <p className="mt-3 rounded-lg bg-[hsl(var(--accent-soft))] px-3 py-2 text-xs text-primary">
                  <span className="font-semibold">Why: </span>{o.why}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="hero" size="sm" onClick={() => toast.info("Booking flow coming soon.")}>
                    Book now
                  </Button>
                  <Button asChild variant="soft" size="sm">
                    <Link to={searchId ? `/option/${o.id}?id=${encodeURIComponent(searchId)}` : `/option/${o.id}`}>View details</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => toast.info("Keep searching — Travixis will refine alternatives.")}>
            Keep searching
          </Button>
          <Button variant="ghost" size="sm" onClick={() => document.getElementById("alternatives")?.scrollIntoView({ behavior: "smooth" })}>
            Show alternatives
          </Button>
          <Button variant="ghost" size="sm" onClick={() => document.getElementById("explanation")?.scrollIntoView({ behavior: "smooth" })}>
            <Lightbulb className="h-4 w-4" /> Explain this recommendation
          </Button>
        </div>
      </section>

      {/* Explanation panel */}
      <section id="explanation" className="rounded-2xl border bg-card p-6 md:p-8 shadow-card">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary shrink-0">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Why Travixis recommends this</h2>
            <p className="text-sm text-muted-foreground">A transparent breakdown of the factors behind our top pick.</p>
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ExplainCard icon={<Wallet className="h-4 w-4" />} title="True total price"
            body="Base fare €218 + taxes €42 + baggage €25 = €285 — no hidden surcharges added at checkout." />
          <ExplainCard icon={<Info className="h-4 w-4" />} title="Hidden cost factors"
            body="No seat-selection fees, no payment surcharge. Baggage is included rather than upsold later." />
          <ExplainCard icon={<Compass className="h-4 w-4" />} title="Route quality"
            body="Direct AMS → LIS, 3h 25m. Avoids tight connections and overnight transfers." />
          <ExplainCard icon={<Gauge className="h-4 w-4" />} title="Risk & stress"
            body="Carrier on-time rate >85%, low historical disruption on this route. Stress score: 12/100." />
          <ExplainCard icon={<Luggage className="h-4 w-4" />} title="Baggage & refund"
            body="Carry-on + 23kg checked included. Refundable up to 24h before departure." />
          <ExplainCard icon={<Sparkles className="h-4 w-4" />} title="Your preferences"
            body="You asked for balanced budget + low stress. This option matches both better than alternatives." />
        </div>
        <p className="mt-6 inline-flex items-start gap-2 rounded-lg bg-[hsl(var(--accent-soft))] px-4 py-3 text-xs text-primary">
          <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            <span className="font-semibold">AI helps. You decide.</span>{" "}
            Travixis does not book automatically — every choice stays in your hands.
          </span>
        </p>
      </section>

      {/* Alternatives */}
      <section id="alternatives" className="rounded-2xl border bg-card p-6 md:p-8 shadow-card">
        <BadgeSoft variant="accent"><Compass className="h-3 w-3" /> Alternatives worth considering</BadgeSoft>
        <h2 className="mt-3 text-xl font-semibold">Want to save more or stress less?</h2>
        <p className="text-sm text-muted-foreground">Travixis explored these adjacent options based on your goal.</p>
        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AltCard icon={<MapPin className="h-4 w-4" />} title="Nearby airports"
            body="Departing from Eindhoven (EIN) saves up to €40 — adds ~1h ground transfer." />
          <AltCard icon={<CalendarRange className="h-4 w-4" />} title="Flexible dates"
            body="Leaving Thursday instead of Friday cuts price by ~18% with similar comfort." />
          <AltCard icon={<Compass className="h-4 w-4" />} title="Cheaper destinations"
            body="Porto (OPO) is €60 cheaper and 1h from Lisbon by train — same region, lower cost." />
          <AltCard icon={<ShieldCheck className="h-4 w-4" />} title="Lower-risk options"
            body="A direct flight with KLM raises price by €46 but lowers stress score to 8/100." />
          <AltCard icon={<Timer className="h-4 w-4" />} title="Shorter travel time"
            body="Direct options under 3h 30m exist — adds €30 vs the cheapest one-stop route." />
          <AltCard icon={<Wallet className="h-4 w-4" />} title="Bundle & save"
            body="Adding a 7-night hotel as a package reduces total trip cost by ~€120." />
        </div>
      </section>

      {/* Wallet intelligence */}
      <WalletInsightsPanel />

      {/* Smart filters */}
      <SmartFiltersBar active={smartFilter} onChange={setSmartFilter} />

      {/* Side-by-side comparison */}
      {compareOptions.length >= 2 && (
        <div data-compare-panel>
          <ComparisonPanel
            options={compareOptions}
            onClear={() => setCompare([])}
            onRemove={(id) => setCompare((c) => c.filter((x) => x !== id))}
          />
        </div>
      )}

      {/* Full list */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">All options</h2>
            <p className="text-[11.5px] text-muted-foreground/80 mt-0.5">{displayOptions.length} matching · explainable Travixis ranking</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground hidden sm:inline">Sort by</span>
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
              <SelectTrigger className="h-8 w-[180px] text-[12.5px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Travixis recommendation</SelectItem>
                <SelectItem value="price">Lowest true total</SelectItem>
                <SelectItem value="stress">Lowest stress</SelectItem>
                <SelectItem value="duration">Shortest duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {displayOptions.map((o) => {
          const total = o.price + o.taxes + o.baggage + o.fees;
          const checked = compare.includes(o.id);
          return (
            <article key={o.id} className="rounded-2xl border bg-card p-5 md:p-6 shadow-card transition-base hover:shadow-elevated">
              <div className="grid lg:grid-cols-[1fr,auto] gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {o.tag && (
                      <BadgeSoft variant={tagMeta[o.tag].variant}>
                        {tagMeta[o.tag].icon} {tagMeta[o.tag].label}
                      </BadgeSoft>
                    )}
                    <RiskBadge score={o.riskScore} />
                    <ConfidenceChip option={o} />
                    <WalletAwareChip totalPrice={o.price + o.taxes + o.baggage + o.fees} />
                  </div>
                  <div className="mt-3 flex items-start gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
                      <Plane className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{o.airline}</h3>
                      <p className="text-sm text-muted-foreground">{o.route}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
                    <Info_ icon={<Clock className="h-4 w-4" />} label="Travel time" value={`${o.duration} · ${o.stops}`} />
                    <Info_ icon={<Luggage className="h-4 w-4" />} label="Baggage" value={o.baggageInfo} />
                    <Info_ icon={<ShieldCheck className="h-4 w-4" />} label="Refund" value={o.refund} />
                  </div>
                  <p className="mt-4 rounded-lg bg-[hsl(var(--accent-soft))] px-3 py-2 text-xs text-primary">
                    <span className="font-semibold">Why recommended: </span>{o.why}
                  </p>
                  <AiInsightRow option={o} />
                  <ConfidenceSignals option={o} />
                </div>

                <div className="flex flex-col items-stretch lg:items-end gap-3 lg:min-w-[220px] lg:border-l lg:pl-6">
                  <div className="lg:text-right">
                    <p className="text-3xl font-bold">{formatMoney(total, o.currency)}</p>
                    <p className="text-xs text-muted-foreground">
                      true total{summaryTravelers ? ` · ${summaryTravelers}` : ""}
                    </p>
                  </div>
                  <details className="text-xs text-muted-foreground lg:text-right">
                    <summary className="cursor-pointer hover:text-foreground">Price breakdown</summary>
                    <ul className="mt-2 space-y-1">
                      <li className="flex justify-between gap-4"><span>Base fare</span><span>{formatMoney(o.price, o.currency)}</span></li>
                      <li className="flex justify-between gap-4"><span>Taxes</span><span>{formatMoney(o.taxes, o.currency)}</span></li>
                      <li className="flex justify-between gap-4"><span>Baggage</span><span>{formatMoney(o.baggage, o.currency)}</span></li>
                      <li className="flex justify-between gap-4"><span>Fees</span><span>{formatMoney(o.fees, o.currency)}</span></li>
                    </ul>
                  </details>
                  <Button asChild variant="hero" size="sm">
                    <Link to={searchId ? `/option/${o.id}?id=${encodeURIComponent(searchId)}` : `/option/${o.id}`}>View details <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                  <label className="flex items-center justify-end gap-2 text-xs text-muted-foreground cursor-pointer">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => setCompare((c) => v ? [...c, o.id] : c.filter((x) => x !== o.id))}
                    />
                    Compare
                  </label>
                </div>
              </div>
            </article>
          );
        })}
      </section>

        </div>
      </div>
      {compare.length > 0 && (
        <div className="hidden md:flex sticky bottom-4 z-30 mx-auto w-full max-w-md rounded-full border bg-card px-5 py-3 shadow-elevated items-center justify-between">
          <span className="text-sm font-medium">{compare.length} selected to compare</span>
          <Button size="sm" variant="hero" onClick={() => setCompareOpen(true)}>
            {compare.length >= 2 ? "Open compare" : "Select 1 more"}
          </Button>
        </div>
      )}

      <CompareDrawer
        open={compareOpen}
        onOpenChange={setCompareOpen}
        options={compareOptions}
        onClear={() => { setCompare([]); setCompareOpen(false); }}
        onRemove={(id) => setCompare((c) => c.filter((x) => x !== id))}
      />

      <MobileResultsBar
        compareCount={compare.length}
        onCompare={() => setCompareOpen(true)}
        onFilters={() => document.querySelector<HTMLButtonElement>('[data-mobile-filters-trigger]')?.click()}
        onSort={() => {
          const order: SortKey[] = ["recommended", "price", "stress", "duration"];
          setSortKey(order[(order.indexOf(sortKey) + 1) % order.length]);
          toast.info(`Sorted by ${order[(order.indexOf(sortKey) + 1) % order.length]}`);
        }}
        onWallet={() => toast.info("Wallet intelligence active — credits applied where eligible.")}
        onExplain={() => document.getElementById("explanation")?.scrollIntoView({ behavior: "smooth" })}
      />
    </div>
  );
};

const ConfidenceSignals = ({ option }: { option: Option }) => {
  const reliability = Math.max(78, Math.min(98, 100 - option.riskScore));
  const signals: { label: string; tone: "success" | "muted" | "warning"; icon: React.ReactNode }[] = [];
  if (option.riskScore < 20) signals.push({ label: `${reliability}% historically reliable route`, tone: "success", icon: <ShieldCheck className="h-3 w-3" /> });
  if (/direct/i.test(option.stops)) signals.push({ label: "Direct — no transfer fatigue", tone: "success", icon: <Plane className="h-3 w-3" /> });
  else if (option.riskScore < 30) signals.push({ label: "Comfortable connection timing", tone: "muted", icon: <Clock className="h-3 w-3" /> });
  else signals.push({ label: "Tight connection — plan a buffer", tone: "warning", icon: <AlertTriangle className="h-3 w-3" /> });
  if (option.baggage > 0 || /included/i.test(option.baggageInfo)) signals.push({ label: "Generous baggage included", tone: "success", icon: <Luggage className="h-3 w-3" /> });
  if (option.riskScore < 25) signals.push({ label: "Arrives at calmer airport hours", tone: "muted", icon: <CloudSun className="h-3 w-3" /> });

  return (
    <div className="mt-3.5 flex flex-wrap gap-1.5">
      {signals.slice(0, 4).map((s, i) => (
        <span
          key={i}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border leading-none",
            s.tone === "success" && "border-[hsl(var(--success))]/20 bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]",
            s.tone === "warning" && "border-[hsl(var(--warning))]/20 bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]",
            s.tone === "muted" && "border-border/60 bg-muted/40 text-muted-foreground",
          )}
        >
          {s.icon} {s.label}
        </span>
      ))}
    </div>
  );
};


const RiskBadge = ({ score }: { score: number }) => {
  const variant = score < 20 ? "success" : score < 40 ? "warning" : "danger";
  const label = score < 20 ? "Low stress" : score < 40 ? "Moderate stress" : "High stress";
  return <BadgeSoft variant={variant}><ShieldCheck className="h-3 w-3" />{label} · {score}/100</BadgeSoft>;
};

const Info_ = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="mt-0.5 text-muted-foreground">{icon}</span>
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</p>
      <p className={cn("text-xs")}>{value}</p>
    </div>
  </div>
);

const ExplainCard = ({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) => (
  <div className="rounded-xl border bg-background p-4">
    <div className="flex items-center gap-2 text-primary">
      <span className="grid h-7 w-7 place-items-center rounded-md bg-[hsl(var(--primary-soft))]">{icon}</span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
    </div>
    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{body}</p>
  </div>
);

const AltCard = ({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) => (
  <button
    type="button"
    onClick={() => toast.info("Alternative selected — refining search.")}
    className="text-left rounded-xl border bg-background p-4 transition-base hover:border-primary/40 hover:shadow-card"
  >
    <div className="flex items-center gap-2 text-[hsl(var(--accent))]">
      <span className="grid h-7 w-7 place-items-center rounded-md bg-[hsl(var(--accent-soft))]">{icon}</span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
    </div>
    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{body}</p>
  </button>
);

const AiInsightRow = ({ option }: { option: Option }) => {
  const total = option.price + option.taxes + option.baggage + option.fees;
  const insights: { icon: React.ReactNode; label: string; tone: "success" | "muted" | "warning" }[] = [];
  if (option.riskScore < 20) insights.push({ icon: <ShieldCheck className="h-3 w-3" />, label: "Low disruption probability", tone: "success" });
  if (option.stops.toLowerCase().startsWith("direct")) insights.push({ icon: <Sparkles className="h-3 w-3" />, label: "Historically reliable route", tone: "success" });
  if (total < 200) insights.push({ icon: <TrendingDown className="h-3 w-3" />, label: "Below typical fare", tone: "success" });
  else if (total > 280) insights.push({ icon: <Info className="h-3 w-3" />, label: "Price expected to rise", tone: "warning" });
  insights.push({ icon: <Gauge className="h-3 w-3" />, label: `AI confidence: ${option.riskScore < 20 ? "High" : option.riskScore < 40 ? "Medium" : "Low"}`, tone: "muted" });

  return (
    <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11.5px] text-muted-foreground">
      {insights.slice(0, 4).map((i, idx) => (
        <li key={idx} className="inline-flex items-center gap-1.5">
          <span className={cn(
            "inline-flex items-center justify-center",
            i.tone === "success" && "text-[hsl(var(--success))]",
            i.tone === "warning" && "text-[hsl(var(--warning))]",
            i.tone === "muted" && "text-muted-foreground/70",
          )}>{i.icon}</span>
          <span>{i.label}</span>
        </li>
      ))}
    </ul>
  );
};

export default ResultsPage;
