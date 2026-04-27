import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeSoft } from "@/components/BadgeSoft";
import { cn } from "@/lib/utils";

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
  riskScore: number; // 0-100, lower is better
  baggageInfo: string;
  refund: string;
  why: string;
  tag?: "best-value" | "lowest-stress" | "cheapest";
};

const options: Option[] = [
  {
    id: "1",
    airline: "TAP Air Portugal",
    route: "AMS → LIS",
    duration: "3h 25m",
    stops: "Direct",
    price: 218, taxes: 42, baggage: 25, fees: 0,
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
    price: 264, taxes: 48, baggage: 0, fees: 0,
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
    price: 119, taxes: 28, baggage: 32, fees: 8,
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
    price: 289, taxes: 52, baggage: 0, fees: 0,
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

const ResultsPage = () => {
  const [compare, setCompare] = useState<string[]>([]);
  const [params] = useSearchParams();
  const fromAutopilot = params.get("from") === "autopilot";
  const recommended = options.filter((o) => o.tag);

  return (
    <div className="container max-w-6xl space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {fromAutopilot && (
            <BadgeSoft variant="accent" className="mb-2"><Wand2 className="h-3 w-3" /> Autopilot result</BadgeSoft>
          )}
          <BadgeSoft variant="primary">Amsterdam → Lisbon · 15–22 Aug · 2 adults</BadgeSoft>
          <h1 className="mt-3 text-3xl font-bold">{options.length} options found</h1>
          <p className="mt-1 text-muted-foreground">Sorted by Travixis recommendation. All prices include taxes & surcharges.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/search">Edit search</Link></Button>
          <Button variant="ghost" onClick={() => toast.info("Keep searching — Travixis will refine alternatives.")}>
            Keep searching
          </Button>
        </div>
      </div>

      {/* A/B/C recommendation block */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Travixis recommends</h2>
        <div className="mt-3 grid md:grid-cols-3 gap-4">
          {recommended.map((o) => {
            const meta = tagMeta[o.tag!];
            const total = o.price + o.taxes + o.baggage + o.fees;
            return (
              <div key={o.id} className="rounded-2xl border bg-card p-5 shadow-card flex flex-col">
                <BadgeSoft variant={meta.variant}>{meta.icon}{meta.label}</BadgeSoft>
                <p className="mt-3 font-semibold">{o.airline}</p>
                <p className="text-xs text-muted-foreground">{o.route} · {o.stops} · {o.duration}</p>
                <p className="mt-3 text-2xl font-bold">€{total}</p>
                <p className="text-xs text-muted-foreground">true total price</p>
                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-start gap-1.5"><Luggage className="h-3 w-3 mt-0.5 shrink-0" /> {o.baggageInfo}</li>
                  <li className="flex items-start gap-1.5"><ShieldCheck className="h-3 w-3 mt-0.5 shrink-0" /> {o.refund}</li>
                  <li className="flex items-start gap-1.5"><Gauge className="h-3 w-3 mt-0.5 shrink-0" /> Stress score {o.riskScore}/100</li>
                </ul>
                <p className="mt-3 rounded-lg bg-[hsl(var(--accent-soft))] px-3 py-2 text-xs text-primary">
                  <span className="font-semibold">Why: </span>{o.why}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="hero" size="sm" onClick={() => toast.info("Booking flow coming soon.")}>
                    Book now
                  </Button>
                  <Button asChild variant="soft" size="sm">
                    <Link to={`/option/${o.id}`}>View details</Link>
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

      {/* Full list */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">All options</h2>
        {options.map((o) => {
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
                </div>

                <div className="flex flex-col items-stretch lg:items-end gap-3 lg:min-w-[220px] lg:border-l lg:pl-6">
                  <div className="lg:text-right">
                    <p className="text-3xl font-bold">€{total}</p>
                    <p className="text-xs text-muted-foreground">true total · 2 travelers</p>
                  </div>
                  <details className="text-xs text-muted-foreground lg:text-right">
                    <summary className="cursor-pointer hover:text-foreground">Price breakdown</summary>
                    <ul className="mt-2 space-y-1">
                      <li className="flex justify-between gap-4"><span>Base fare</span><span>€{o.price}</span></li>
                      <li className="flex justify-between gap-4"><span>Taxes</span><span>€{o.taxes}</span></li>
                      <li className="flex justify-between gap-4"><span>Baggage</span><span>€{o.baggage}</span></li>
                      <li className="flex justify-between gap-4"><span>Fees</span><span>€{o.fees}</span></li>
                    </ul>
                  </details>
                  <Button asChild variant="hero" size="sm">
                    <Link to={`/option/${o.id}`}>View details <ArrowRight className="h-4 w-4" /></Link>
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

      {compare.length > 0 && (
        <div className="sticky bottom-4 z-30 mx-auto w-full max-w-md rounded-full border bg-card px-5 py-3 shadow-elevated flex items-center justify-between">
          <span className="text-sm font-medium">{compare.length} selected to compare</span>
          <Button size="sm" variant="hero" onClick={() => toast.info("Side-by-side compare coming soon.")}>Compare</Button>
        </div>
      )}
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

export default ResultsPage;
