// ============================================================================
// OperationalTimeline
// Phased pre-trip / day-of / post-trip view of a Trip. Reads from travel-os
// entities so the structure stays stable when wired to a backend.
// ============================================================================

import {
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Stamp,
  Cloud,
  Building2,
  Luggage,
  Armchair,
  DoorOpen,
  Car,
  PlaneTakeoff,
  PlaneLanding,
  Train,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Wallet,
  Clock,
  MapPin,
  Bell,
} from "lucide-react";
import { BadgeSoft } from "@/components/BadgeSoft";
import { cn } from "@/lib/utils";
import type { Trip } from "@/lib/travel-os";

type Phase = "pre" | "day" | "post";
type Status = "done" | "current" | "upcoming";

type Step = {
  icon: any;
  title: string;
  meta: string;
  status: Status;
  signal?: string;
};

const phaseMeta: Record<Phase, { label: string; tag: string }> = {
  pre: { label: "Pre-trip", tag: "Preparation" },
  day: { label: "Day of travel", tag: "Operations" },
  post: { label: "Post-trip", tag: "Reconciliation" },
};

const computePhases = (trip: Trip): Record<Phase, Step[]> => {
  const seg = trip.bookings[0]?.segments[0];
  const arrive = seg?.to.city ?? "destination";
  const from = seg?.from.code ?? "—";
  const to = seg?.to.code ?? "—";

  return {
    pre: [
      { icon: CheckCircle2, title: "Booking confirmed", meta: `Ref ${trip.bookings[0]?.reference ?? "—"}`, status: "done" },
      { icon: CreditCard, title: "Payment confirmed", meta: `€${trip.bookings[0]?.total ?? 0} settled`, status: "done" },
      { icon: ShieldCheck, title: "Passport verified", meta: "Valid through 2031 · TSA PreCheck on file", status: "done" },
      { icon: Stamp, title: "Visa requirements", meta: `No visa required for ${arrive}`, status: "done" },
      { icon: Armchair, title: "Seat confirmed", meta: `${seg?.seat ?? "—"} · window preference matched`, status: "done", signal: "Profile match" },
      { icon: Cloud, title: "Weather watch", meta: `${trip.weatherConfidence}% confidence at arrival`, status: "current", signal: "Improving" },
      { icon: Building2, title: "Terminal prediction", meta: `${seg?.from.terminal ?? "—"} → ${seg?.to.terminal ?? "—"}`, status: "current" },
      { icon: Luggage, title: "Baggage reminder", meta: "1 cabin · 1 checked (23kg)", status: "upcoming" },
      { icon: Bell, title: "Check-in countdown", meta: "Auto check-in 24h before departure", status: "upcoming" },
    ],
    day: [
      { icon: Clock, title: "Leave-now recommendation", meta: `${from} security low — depart 2h 15m before`, status: "upcoming", signal: "Calm window" },
      { icon: DoorOpen, title: "Live gate prediction", meta: `Gate ${seg?.gate ?? "TBD"} (predicted)`, status: "upcoming" },
      { icon: MapPin, title: "Terminal navigation", meta: "Walking route + lounge access loaded", status: "upcoming" },
      { icon: PlaneTakeoff, title: "Boarding & departure", meta: `${seg?.carrier ?? ""} ${seg?.number ?? ""} · ${trip.disruptionRisk}% disruption risk`, status: "upcoming" },
      { icon: PlaneLanding, title: "Arrival & baggage belt", meta: "Belt prediction unlocks 30 min before landing", status: "upcoming" },
      { icon: Train, title: "Calmer route alternatives", meta: "Rail option monitored — currently no advantage", status: "upcoming" },
      { icon: Car, title: "Transfer to stay", meta: "Airport metro · €1.85 · 25 min", status: "upcoming" },
    ],
    post: [
      { icon: RefreshCw, title: "Refund tracking", meta: "Auto-monitor for fare drops & service credits", status: "upcoming" },
      { icon: Wallet, title: "Wallet reconciliation", meta: "Spend matched to allocated budget", status: "upcoming" },
      { icon: TrendingUp, title: "Loyalty progress", meta: "KLM Flying Blue · expected +1,840 miles", status: "upcoming" },
      { icon: Sparkles, title: "AI travel summary", meta: "Calm score, sleep quality, transfer ease", status: "upcoming" },
      { icon: ShieldCheck, title: "Calm travel score", meta: `Trip score baseline ${trip.calmScore}`, status: "upcoming" },
    ],
  };
};

const stepDot = (status: Status) =>
  cn(
    "relative z-10 grid h-8 w-8 place-items-center rounded-full border bg-card shrink-0",
    status === "done" && "border-[hsl(var(--success))] text-[hsl(var(--success))] bg-[hsl(var(--success-soft))]",
    status === "current" && "border-primary text-primary bg-[hsl(var(--primary-soft))] shadow-card",
    status === "upcoming" && "border-border text-muted-foreground",
  );

export const OperationalTimeline = ({ trip }: { trip: Trip }) => {
  const phases = computePhases(trip);
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-card">
      <header className="mb-5">
        <BadgeSoft variant="primary"><Clock className="h-3 w-3" /> Operational timeline</BadgeSoft>
        <h2 className="mt-2 text-xl font-semibold">Your trip, end to end</h2>
        <p className="text-sm text-muted-foreground">
          Pre-trip preparation, day-of operations, and post-trip reconciliation — tracked automatically.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {(["pre", "day", "post"] as Phase[]).map((phase) => (
          <div key={phase} className="rounded-xl border bg-background p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-muted-foreground">
                {phaseMeta[phase].label}
              </p>
              <BadgeSoft variant="accent">{phaseMeta[phase].tag}</BadgeSoft>
            </div>
            <ol className="relative">
              <span className="absolute left-[15px] top-2 bottom-2 w-px bg-border" aria-hidden />
              {phases[phase].map((s, i) => (
                <li key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                  <div className={stepDot(s.status)}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={cn("text-sm font-medium", s.status === "upcoming" && "text-muted-foreground")}>
                        {s.title}
                      </p>
                      {s.status === "current" && <BadgeSoft variant="primary">Live</BadgeSoft>}
                      {s.status === "done" && <BadgeSoft variant="success">Done</BadgeSoft>}
                      {s.signal && <BadgeSoft variant="accent">{s.signal}</BadgeSoft>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.meta}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OperationalTimeline;
