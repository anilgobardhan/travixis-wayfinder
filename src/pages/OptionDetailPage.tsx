import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Plane,
  Clock,
  Luggage,
  ShieldCheck,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeSoft } from "@/components/BadgeSoft";
import {
  api,
  type SearchRequestSnapshot,
  type SearchOptionFromBackend,
} from "@/lib/api";

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
    return `${currency} ${amount.toFixed(2)}`;
  }
};

// "2026-04-15" -> "Wed, 15 Apr". Returns the raw input on parse failure
// so the UI never silently swallows a bad-but-present date.
const formatTripDate = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const OptionDetailPage = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const searchId = params.get("id") || undefined;

  // Single source of truth: the backend's request snapshot, fetched by searchId.
  const [tripRequest, setTripRequest] = useState<SearchRequestSnapshot | null>(null);
  const [selectedOption, setSelectedOption] = useState<SearchOptionFromBackend | null>(null);

  useEffect(() => {
    if (!searchId) {
      setTripRequest(null);
      setSelectedOption(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getSearch(searchId);
        if (cancelled) return;
        setTripRequest(data?.request ?? null);
        const options =
          data?.results?.options ??
          data?.options ??
          data?.recommendations ??
          data?.search?.options ??
          [];
        const found =
          options.find((o) => String(o.id) === String(id)) ?? options[0] ?? null;
        setSelectedOption(found);
      } catch {
        if (cancelled) return;
        setTripRequest(null);
        setSelectedOption(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchId, id]);

  const origin = (tripRequest?.from ?? "").toUpperCase();
  const destination = (tripRequest?.to ?? "").toUpperCase();
  const departDate = tripRequest?.departDate ?? "";
  const returnDate = tripRequest?.returnDate ?? "";
  const travelers =
    typeof tripRequest?.travelers === "number" && tripRequest.travelers >= 1
      ? tripRequest.travelers
      : 1;

  const originLabel = origin || "Origin";
  const destinationLabel = destination || "Destination";
  const routeLabel =
    origin && destination ? `${origin} ↔ ${destination}` : "Your trip";

  const outboundDate = formatTripDate(departDate);
  const returnDateText = formatTripDate(returnDate);

  // Per-segment timing remains placeholder (backend does not yet expose it
  // per option). Dates, route, and travelers come from the canonical snapshot.
  const segments = [
    {
      from: `${originLabel} (${origin || "—"})`,
      to: `${destinationLabel} (${destination || "—"})`,
      date: outboundDate,
      depart: "06:15",
      arrive: "08:40",
      flight: "TP671",
      duration: "3h 25m",
    },
    {
      from: `${destinationLabel} (${destination || "—"})`,
      to: `${originLabel} (${origin || "—"})`,
      date: returnDateText,
      depart: "19:10",
      arrive: "23:30",
      flight: "TP664",
      duration: "3h 20m",
    },
  ];

  // Prefer real numbers from the selected option; fall back to placeholders
  // only when no live option is available.
  const breakdownFromBackend = selectedOption?.explanation?.priceBreakdown;
  const optionTotalPrice =
    typeof selectedOption?.price === "number" ? selectedOption.price : undefined;
  const perTravelerBaseFare =
    typeof breakdownFromBackend?.baseFare === "number"
      ? breakdownFromBackend.baseFare
      : 218;
  const perTravelerBaggage =
    typeof breakdownFromBackend?.baggage === "number"
      ? breakdownFromBackend.baggage
      : 25;
  const taxesTotal =
    typeof breakdownFromBackend?.taxes === "number"
      ? breakdownFromBackend.taxes
      : 84;
  const baseFareTotal = travelers * perTravelerBaseFare;
  const baggageTotal = travelers * perTravelerBaggage;
  const optionCurrency =
    typeof selectedOption?.currency === "string" && selectedOption.currency.length > 0
      ? selectedOption.currency
      : "EUR";

  const breakdown = [
    { label: `Base fare (${travelers} × €${perTravelerBaseFare})`, value: baseFareTotal },
    { label: "Taxes & airport fees", value: taxesTotal },
    { label: `Checked baggage (${travelers} × 23kg)`, value: baggageTotal },
    { label: "Seat selection", value: 0 },
    { label: "Travixis service fee", value: 0 },
  ];
  const computedTotal = breakdown.reduce((s, b) => s + b.value, 0);
  const total =
    typeof optionTotalPrice === "number" ? Math.round(optionTotalPrice * travelers) : computedTotal;
  const travelersLabel = `${travelers} ${travelers === 1 ? "traveler" : "travelers"}`;

  return (
    <div className="container max-w-5xl space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link to={searchId ? `/results?id=${encodeURIComponent(searchId)}` : "/results"} className="text-sm text-muted-foreground hover:text-foreground">← Back to results</Link>
          <h1 className="mt-2 text-3xl font-bold">TAP Air Portugal · Direct</h1>
          <p className="text-muted-foreground">Option #{id} · {routeLabel}</p>
        </div>
        <BadgeSoft variant="primary"><Sparkles className="h-3 w-3" /> Best value</BadgeSoft>
      </div>

      <div className="grid lg:grid-cols-[1fr,360px] gap-6">
        {/* Main */}
        <div className="space-y-6">
          {/* Itinerary */}
          <Card title="Full itinerary" icon={<Plane className="h-4 w-4" />}>
            <ol className="space-y-5">
              {segments.map((s, i) => (
                <li key={i} className="rounded-xl border bg-background p-4">
                  <p className="text-xs text-muted-foreground">{s.date} · Flight {s.flight}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div>
                      <p className="text-xl font-semibold">{s.depart}</p>
                      <p className="text-xs text-muted-foreground">{s.from}</p>
                    </div>
                    <div className="flex-1 flex items-center gap-2 text-muted-foreground">
                      <span className="h-px flex-1 bg-border" />
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">{s.duration}</span>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold">{s.arrive}</p>
                      <p className="text-xs text-muted-foreground">{s.to}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          {/* Why */}
          <Card title="Why this option?" icon={<Sparkles className="h-4 w-4" />}>
            <ul className="space-y-3 text-sm">
              <Reason variant="success">Direct flight in both directions — minimal disruption risk</Reason>
              <Reason variant="success">Includes 23kg checked baggage per traveler in the price shown</Reason>
              <Reason variant="success">Refundable up to 24 hours before departure</Reason>
              <Reason variant="warning">Early morning departure (06:15) — plan transport in advance</Reason>
            </ul>
          </Card>

          {/* Risk */}
          <Card title="Risk explanation" icon={<ShieldCheck className="h-4 w-4" />}>
            <div className="flex items-center gap-3">
              <BadgeSoft variant="success">Low stress · 12/100</BadgeSoft>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Both flights are direct with strong on-time performance over the past 90 days.
              No tight connections, no overnight transfers. Cancellation rate on this route is below 2%.
            </p>
          </Card>

          {/* Baggage */}
          <Card title="Baggage rules" icon={<Luggage className="h-4 w-4" />}>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between"><span>Carry-on (8kg)</span><span className="text-[hsl(var(--success))]">Included</span></li>
              <li className="flex justify-between"><span>Checked bag (23kg)</span><span className="text-[hsl(var(--success))]">Included</span></li>
              <li className="flex justify-between"><span>Extra bag</span><span>€45 each way</span></li>
            </ul>
          </Card>

          {/* Visa placeholder */}
          <Card title="Visa & immigration" icon={<FileText className="h-4 w-4" />}>
            <p className="text-sm text-muted-foreground">
              For EU citizens, no visa is required for travel between Netherlands and Portugal.
              <span className="block mt-2 italic">Visa engine integration coming soon — Travixis will check your nationality automatically.</span>
            </p>
          </Card>

          {/* Refund */}
          <Card title="Refund & cancellation" icon={<RotateCcw className="h-4 w-4" />}>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>✓ Free cancellation up to 24h before departure</li>
              <li>✓ Free date change up to 7 days before departure (€30 fee after)</li>
              <li>! Name changes not allowed</li>
            </ul>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="rounded-2xl border bg-card p-5 shadow-elevated">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">True total price</p>
            <p className="mt-1 text-4xl font-bold">{formatMoney(total, optionCurrency)}</p>
            <p className="text-xs text-muted-foreground">{travelersLabel} · all fees included</p>

            <ul className="mt-5 space-y-2 text-sm border-t pt-4">
              {breakdown.map((b) => (
                <li key={b.label} className="flex justify-between text-muted-foreground">
                  <span>{b.label}</span>
                  <span className="font-medium text-foreground">{formatMoney(b.value, optionCurrency)}</span>
                </li>
              ))}
            </ul>

            <Button asChild variant="hero" size="lg" className="mt-5 w-full">
              <Link to="/trip-dashboard">Continue <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => toast.info("Booking flow coming soon.")}
            >
              Book this option
            </Button>
            <p className="mt-3 text-[11px] text-muted-foreground text-center">
              You'll review every detail before any payment is taken.
            </p>
          </div>

          <div className="rounded-2xl border bg-[hsl(var(--warning-soft))] p-4 text-xs text-[hsl(var(--warning))]">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" /> Heads up
            </div>
            <p className="mt-1 text-foreground/80">
              Lisbon airport experiences delays during summer evenings. We monitor your flight 24/7 after booking.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Card = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <section className="rounded-2xl border bg-card p-5 shadow-card">
    <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {title}
    </h2>
    <div className="mt-4">{children}</div>
  </section>
);

const Reason = ({ variant, children }: { variant: "success" | "warning"; children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <BadgeSoft variant={variant}>{variant === "success" ? "+" : "!"}</BadgeSoft>
    <span className="pt-0.5">{children}</span>
  </li>
);

export default OptionDetailPage;
