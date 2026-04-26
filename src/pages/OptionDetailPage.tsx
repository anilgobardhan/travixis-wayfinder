import { Link, useParams } from "react-router-dom";
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

const OptionDetailPage = () => {
  const { id } = useParams();

  const segments = [
    { from: "Amsterdam (AMS)", to: "Lisbon (LIS)", date: "Fri, 15 Aug", depart: "06:15", arrive: "08:40", flight: "TP671", duration: "3h 25m" },
    { from: "Lisbon (LIS)", to: "Amsterdam (AMS)", date: "Fri, 22 Aug", depart: "19:10", arrive: "23:30", flight: "TP664", duration: "3h 20m" },
  ];

  const breakdown = [
    { label: "Base fare (2 × €218)", value: 436 },
    { label: "Taxes & airport fees", value: 84 },
    { label: "Checked baggage (2 × 23kg)", value: 50 },
    { label: "Seat selection", value: 0 },
    { label: "Travixis service fee", value: 0 },
  ];
  const total = breakdown.reduce((s, b) => s + b.value, 0);

  return (
    <div className="container max-w-5xl space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link to="/results" className="text-sm text-muted-foreground hover:text-foreground">← Back to results</Link>
          <h1 className="mt-2 text-3xl font-bold">TAP Air Portugal · Direct</h1>
          <p className="text-muted-foreground">Option #{id} · Amsterdam ↔ Lisbon</p>
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
            <p className="mt-1 text-4xl font-bold">€{total}</p>
            <p className="text-xs text-muted-foreground">2 travelers · all fees included</p>

            <ul className="mt-5 space-y-2 text-sm border-t pt-4">
              {breakdown.map((b) => (
                <li key={b.label} className="flex justify-between text-muted-foreground">
                  <span>{b.label}</span>
                  <span className="font-medium text-foreground">€{b.value}</span>
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
