import {
  Plane,
  Hotel,
  CheckCircle2,
  Clock,
  PlaneLanding,
  PlaneTakeoff,
  ArrowRightLeft,
  KeyRound,
  Bell,
  AlertTriangle,
  Cloud,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Gauge,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { BadgeSoft } from "@/components/BadgeSoft";
import { cn } from "@/lib/utils";

/* ───── Trip Timeline ───── */
type TimelineStep = {
  icon: any;
  title: string;
  meta: string;
  status: "done" | "current" | "upcoming";
};

export const TripTimeline = ({ steps }: { steps?: TimelineStep[] }) => {
  const data: TimelineStep[] = steps ?? [
    { icon: CheckCircle2, title: "Booking confirmed", meta: "All travelers verified", status: "done" },
    { icon: KeyRound, title: "Online check-in", meta: "Opens 24h before departure", status: "current" },
    { icon: PlaneTakeoff, title: "Departure · Outbound", meta: "Gate info 2h before", status: "upcoming" },
    { icon: ArrowRightLeft, title: "Layover (if any)", meta: "Transfer guidance ready", status: "upcoming" },
    { icon: PlaneLanding, title: "Arrival", meta: "Airport-to-hotel transit shown", status: "upcoming" },
    { icon: Hotel, title: "Hotel check-in", meta: "Confirmation in document vault", status: "upcoming" },
    { icon: Plane, title: "Return flight", meta: "Reminders 48h prior", status: "upcoming" },
  ];

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <BadgeSoft variant="primary"><CalendarDays className="h-3 w-3" /> Trip timeline</BadgeSoft>
          <h2 className="mt-2 text-xl font-semibold">Your full journey at a glance</h2>
          <p className="text-sm text-muted-foreground">Every step Travixis tracks for you.</p>
        </div>
      </div>

      <ol className="relative">
        <span className="absolute left-[15px] top-2 bottom-2 w-px bg-border" aria-hidden />
        {data.map((s, i) => (
          <li key={i} className="relative flex items-start gap-4 pb-5 last:pb-0">
            <div
              className={cn(
                "relative z-10 grid h-8 w-8 place-items-center rounded-full border bg-card shrink-0",
                s.status === "done" && "border-[hsl(var(--success))] text-[hsl(var(--success))] bg-[hsl(var(--success-soft))]",
                s.status === "current" && "border-primary text-primary bg-[hsl(var(--primary-soft))] shadow-card",
                s.status === "upcoming" && "border-border text-muted-foreground"
              )}
            >
              <s.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={cn("font-medium text-sm", s.status === "upcoming" && "text-muted-foreground")}>{s.title}</p>
                {s.status === "current" && <BadgeSoft variant="primary">Next</BadgeSoft>}
                {s.status === "done" && <BadgeSoft variant="success">Done</BadgeSoft>}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{s.meta}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

/* ───── Smart Alerts Center ───── */
const alertsSeed = [
  { icon: Bell, tone: "primary", title: "Gate change detected", desc: "TP671 moved from D24 to D31. Plenty of time — no action needed." },
  { icon: Sparkles, tone: "success", title: "Better itinerary available", desc: "KLM direct now matches your price with a 90-min shorter trip." },
  { icon: Cloud, tone: "warning", title: "Weather watch", desc: "Light storms forecast at LIS on arrival day. Buffer recommended." },
  { icon: TrendingUp, tone: "success", title: "Price improved", desc: "Your fare class dropped €38 — credit on file for next booking." },
  { icon: CheckCircle2, tone: "success", title: "Check-in available", desc: "Auto check-in completed. Boarding pass ready in vault." },
  { icon: AlertTriangle, tone: "warning", title: "Airport congestion elevated", desc: "AMS security wait ~35 min. Suggested arrival 2h 15m before." },
  { icon: Gauge, tone: "warning", title: "Delay probability increased", desc: "On-time score dipped to 78%. Connection still safe (2h 10m)." },
];

const toneClass = (t: string) =>
  t === "success" ? "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]"
  : t === "warning" ? "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]"
  : "bg-[hsl(var(--primary-soft))] text-primary";

export const SmartAlertsCenter = () => (
  <section className="rounded-2xl border bg-card p-6 shadow-card">
    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
      <div>
        <BadgeSoft variant="accent"><Bell className="h-3 w-3" /> Smart alerts</BadgeSoft>
        <h2 className="mt-2 text-xl font-semibold">Useful, calm, never spammy</h2>
        <p className="text-sm text-muted-foreground">Only the alerts that genuinely matter for your trip.</p>
      </div>
    </div>
    <ul className="space-y-3">
      {alertsSeed.map((a) => (
        <li key={a.title} className="rounded-xl border bg-background p-4 flex items-start gap-3 transition-base hover:shadow-card">
          <div className={cn("grid h-9 w-9 place-items-center rounded-lg shrink-0", toneClass(a.tone))}>
            <a.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm">{a.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

/* ───── Trip Health Overview ───── */
type HealthMetric = { label: string; score: number; tone: "success" | "warning" | "danger"; note: string };

const healthSeed: HealthMetric[] = [
  { label: "Overall trip confidence", score: 91, tone: "success", note: "All legs verified, low disruption probability." },
  { label: "Schedule quality", score: 88, tone: "success", note: "No tight transfers, healthy buffer windows." },
  { label: "Transfer comfort", score: 84, tone: "success", note: "Same-terminal connection at MAD." },
  { label: "Travel readiness", score: 76, tone: "warning", note: "Passport expiry within 9 months — still valid for trip." },
  { label: "Disruption exposure", score: 18, tone: "success", note: "Lower 18% historic risk for this corridor." },
];

export const TripHealthOverview = ({ metrics }: { metrics?: HealthMetric[] }) => {
  const data = metrics ?? healthSeed;
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="mb-5">
        <BadgeSoft variant="primary"><ShieldCheck className="h-3 w-3" /> Trip health</BadgeSoft>
        <h2 className="mt-2 text-xl font-semibold">A calm overview of your trip readiness</h2>
        <p className="text-sm text-muted-foreground">No alarms — just clarity on where you stand.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((m) => (
          <div key={m.label} className="rounded-xl border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{m.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p
                className={cn(
                  "text-2xl font-bold",
                  m.tone === "success" && "text-[hsl(var(--success))]",
                  m.tone === "warning" && "text-[hsl(var(--warning))]",
                  m.tone === "danger" && "text-destructive"
                )}
              >
                {m.score}
              </p>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  m.tone === "success" && "bg-[hsl(var(--success))]",
                  m.tone === "warning" && "bg-[hsl(var(--warning))]",
                  m.tone === "danger" && "bg-destructive"
                )}
                style={{ width: `${Math.min(100, m.score)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{m.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
