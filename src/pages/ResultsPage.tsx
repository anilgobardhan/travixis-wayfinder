import { Link } from "react-router-dom";
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
  const recommended = options.filter((o) => o.tag);

  return (
    <div className="container max-w-6xl space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <BadgeSoft variant="primary">Amsterdam → Lisbon · 15–22 Aug · 2 adults</BadgeSoft>
          <h1 className="mt-3 text-3xl font-bold">{options.length} options found</h1>
          <p className="mt-1 text-muted-foreground">Sorted by Travixis recommendation. All prices include taxes & surcharges.</p>
        </div>
        <Button asChild variant="outline"><Link to="/search">Edit search</Link></Button>
      </div>

      {/* A/B/C recommendation block */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Travixis recommends</h2>
        <div className="mt-3 grid md:grid-cols-3 gap-4">
          {recommended.map((o) => {
            const meta = tagMeta[o.tag!];
            return (
              <div key={o.id} className="rounded-2xl border bg-card p-5 shadow-card">
                <BadgeSoft variant={meta.variant}>{meta.icon}{meta.label}</BadgeSoft>
                <p className="mt-3 font-semibold">{o.airline}</p>
                <p className="text-xs text-muted-foreground">{o.route} · {o.stops} · {o.duration}</p>
                <p className="mt-3 text-2xl font-bold">€{o.price + o.taxes + o.baggage + o.fees}</p>
                <p className="text-xs text-muted-foreground">true total price</p>
                <Button asChild variant="soft" size="sm" className="mt-4 w-full">
                  <Link to={`/option/${o.id}`}>View details</Link>
                </Button>
              </div>
            );
          })}
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

export default ResultsPage;
