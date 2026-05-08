import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Plane,
  CloudSun,
  DoorOpen,
  Armchair,
  Wallet,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Bell,
  Bookmark,
  TrendingDown,
  TrendingUp,
  Clock,
  MapPin,
  Gauge,
  Compass,
  Train,
  Gift,
  Users,
  CheckCircle2,
  AlertTriangle,
  CircleDot,
  Plus,
  ChevronRight,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeSoft } from "@/components/BadgeSoft";

// ============================================================================
// Travel OS — Personal Dashboard
// Calm, operational, premium. No gimmicks. All tokens via design system.
// ============================================================================

// Next departure (frontend prototype data — realistic).
const FLIGHT = {
  airline: "KLM",
  flight: "KL1693",
  from: { city: "Amsterdam", code: "AMS", terminal: "Terminal 3", time: "07:55" },
  to: { city: "Lisbon", code: "LIS", terminal: "Terminal 1", time: "10:25" },
  date: "Tue, 14 Jul 2026",
  seat: "14A · window",
  gate: "D58",
  gatePredicted: true,
  walletCoverage: 82,
  calmScore: 86,
};

// Live target for countdown — locked to dashboard freshness, not real-time.
const DEPART_AT = new Date("2026-07-14T07:55:00+02:00").getTime();

const useCountdown = (target: number) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return { d, h, m };
};

const DashboardPage = () => {
  const { d, h, m } = useCountdown(DEPART_AT);

  return (
    <div className="container max-w-7xl space-y-7">
      {/* Header */}
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-muted-foreground">
            Travel OS · Dashboard
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight">Good to see you, Alex.</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Everything looks calm. AI is monitoring 4 active signals across your trips.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/notifications" aria-label="Notifications">
              <Bell className="h-4 w-4" /> 3 updates
            </Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/search">
              Plan a trip <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* === HERO: Upcoming trip ============================================ */}
      <section
        aria-labelledby="upcoming-trip"
        className="relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-elevated"
      >
        {/* subtle ambient stripe */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden />
        <div className="grid lg:grid-cols-[1.3fr_1fr]">
          {/* Left: route */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <BadgeSoft variant="success" icon={<CheckCircle2 className="h-3 w-3" />}>
                  On time · confidence high
                </BadgeSoft>
                <BadgeSoft variant="primary" icon={<Sparkles className="h-3 w-3" />}>
                  Calm score {FLIGHT.calmScore}
                </BadgeSoft>
              </div>
              <p className="text-[11.5px] text-muted-foreground tabular-nums">
                {FLIGHT.airline} {FLIGHT.flight} · {FLIGHT.date}
              </p>
            </div>

            <h2 id="upcoming-trip" className="sr-only">Next departure</h2>

            <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-end gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">From</p>
                <p className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight tabular-nums">{FLIGHT.from.code}</p>
                <p className="text-[13px] text-muted-foreground">{FLIGHT.from.city}</p>
                <p className="mt-2 text-[12px] text-foreground tabular-nums">{FLIGHT.from.time} · {FLIGHT.from.terminal}</p>
              </div>
              <div className="flex flex-col items-center pb-1.5 select-none" aria-hidden>
                <Plane className="h-4 w-4 text-primary -rotate-12" />
                <span className="mt-1 h-px w-20 md:w-32 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">2h 30m · direct</span>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">To</p>
                <p className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight tabular-nums">{FLIGHT.to.code}</p>
                <p className="text-[13px] text-muted-foreground">{FLIGHT.to.city}</p>
                <p className="mt-2 text-[12px] text-foreground tabular-nums">{FLIGHT.to.time} · {FLIGHT.to.terminal}</p>
              </div>
            </div>

            {/* Operational strip */}
            <dl className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-3">
              <OpStat icon={<Clock className="h-3.5 w-3.5" />} label="Departs in" value={`${d}d ${h}h ${m}m`} />
              <OpStat icon={<DoorOpen className="h-3.5 w-3.5" />} label="Gate (predicted)" value={FLIGHT.gate} hint="Confirmed ~3h before" />
              <OpStat icon={<Armchair className="h-3.5 w-3.5" />} label="Seat" value={FLIGHT.seat} />
              <OpStat icon={<CloudSun className="h-3.5 w-3.5" />} label="Lisbon arrival" value="24° · clear" hint="Weather confidence high" />
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button asChild variant="hero" size="sm"><Link to="/trip">Open trip <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="soft" size="sm"><Link to="/documents">Documents</Link></Button>
              <Button asChild variant="ghost" size="sm"><Link to="/booking-review">Booking review</Link></Button>
            </div>
          </div>

          {/* Right: AI reassurance & wallet coverage */}
          <aside className="border-t lg:border-t-0 lg:border-l border-border/70 bg-[hsl(var(--primary-soft))]/35 p-6 md:p-8 flex flex-col gap-5">
            <div>
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-primary">
                <Sparkles className="h-3 w-3" /> AI reassurance
              </p>
              <ul className="mt-3 space-y-2.5 text-[13px] text-foreground/90 leading-relaxed">
                <ReassureRow tone="success">Historically smoother route — 92% on-time over 6 months.</ReassureRow>
                <ReassureRow tone="success">Quieter departure window detected at AMS Terminal 3.</ReassureRow>
                <ReassureRow tone="primary">Wallet covers 82% of this trip — €248 remaining balance.</ReassureRow>
              </ul>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-primary" /> Wallet coverage</p>
                <p className="text-[12px] font-semibold tabular-nums text-primary">{FLIGHT.walletCoverage}%</p>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary/80" style={{ width: `${FLIGHT.walletCoverage}%` }} />
              </div>
              <p className="mt-2 text-[11.5px] text-muted-foreground">€1,172 from credits · €248 due on card</p>
            </div>
          </aside>
        </div>
      </section>

      {/* === Two columns: Intelligence feed + side stack ===================== */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <IntelligenceFeed />
        <div className="space-y-5">
          <WalletOverview />
          <NotificationsCenter />
        </div>
      </div>

      {/* === Saved searches + Travel profile ================================ */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <SavedSearches />
        <TravelProfileCard />
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ────────────────────────────────────────────────────────────────────────────

const OpStat = ({
  icon, label, value, hint,
}: { icon: React.ReactNode; label: string; value: string; hint?: string }) => (
  <div className="rounded-xl border border-border/60 bg-background/60 px-3.5 py-3">
    <dt className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground">
      {icon} {label}
    </dt>
    <dd className="mt-1 text-[15px] font-semibold tracking-tight tabular-nums">{value}</dd>
    {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
  </div>
);

const ReassureRow = ({ tone, children }: { tone: "success" | "primary" | "warning"; children: React.ReactNode }) => {
  const dot =
    tone === "success" ? "bg-[hsl(var(--success))]" : tone === "warning" ? "bg-[hsl(var(--warning))]" : "bg-primary";
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "" }}>
        <span className={`block h-full w-full rounded-full ${dot}`} />
      </span>
      <span>{children}</span>
    </li>
  );
};

// --- Intelligence feed -----------------------------------------------------

type FeedTone = "success" | "primary" | "warning" | "neutral";
const FEED: { id: string; icon: React.ReactNode; tone: FeedTone; title: string; body: string; meta: string }[] = [
  { id: "1", icon: <TrendingDown className="h-3.5 w-3.5" />, tone: "success", title: "Airport congestion easing at AMS", body: "Security wait dropped to 12 min — quieter than typical Tuesday.", meta: "2 min ago" },
  { id: "2", icon: <CloudSun className="h-3.5 w-3.5" />, tone: "success", title: "Weather confidence improving in Lisbon", body: "Arrival window now 92% clear — earlier model showed 78%.", meta: "14 min ago" },
  { id: "3", icon: <Gauge className="h-3.5 w-3.5" />, tone: "primary", title: "Calmer departure window detected", body: "Shifting departure 35 min earlier reduces predicted disruption by 18%.", meta: "32 min ago" },
  { id: "4", icon: <Train className="h-3.5 w-3.5" />, tone: "primary", title: "Rail alternative now faster on return", body: "Lisbon → Porto rail beats short-haul flight by 22 min door-to-door.", meta: "1 h ago" },
  { id: "5", icon: <ShieldCheck className="h-3.5 w-3.5" />, tone: "success", title: "Baggage pressure low at AMS", body: "Belt utilization 41% — historically calm for your terminal.", meta: "2 h ago" },
  { id: "6", icon: <AlertTriangle className="h-3.5 w-3.5" />, tone: "warning", title: "Minor disruption monitored on FCO route", body: "ATC slowdown — does not affect any of your booked flights.", meta: "3 h ago" },
];

const IntelligenceFeed = () => (
  <section className="rounded-2xl border border-border/70 bg-card p-5 md:p-6 shadow-card">
    <header className="flex items-center justify-between mb-4">
      <div>
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-primary">
          <Sparkles className="h-3 w-3" /> AI intelligence feed
        </p>
        <h2 className="mt-1 text-[17px] font-semibold tracking-tight">Operational signals</h2>
      </div>
      <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="relative grid h-1.5 w-1.5 place-items-center">
          <span className="absolute inset-0 rounded-full bg-[hsl(var(--success))]/40 ambient-pulse" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
        </span>
        Live
      </span>
    </header>
    <ol className="relative space-y-1">
      <span className="absolute left-[15px] top-2 bottom-2 w-px bg-border/70" aria-hidden />
      {FEED.map((f) => (
        <li key={f.id} className="relative pl-10 py-2.5 group">
          <span
            className={`absolute left-1.5 top-3 grid h-7 w-7 place-items-center rounded-full ring-4 ring-card ${
              f.tone === "success"
                ? "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]"
                : f.tone === "warning"
                ? "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]"
                : "bg-[hsl(var(--primary-soft))] text-primary"
            }`}
          >
            {f.icon}
          </span>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold tracking-tight">{f.title}</p>
              <p className="mt-0.5 text-[12.5px] text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
            <span className="text-[11px] text-muted-foreground tabular-nums whitespace-nowrap">{f.meta}</span>
          </div>
        </li>
      ))}
    </ol>
    <div className="mt-4 pt-4 border-t border-border/60 text-[11.5px] text-muted-foreground flex items-center gap-1.5">
      <ShieldCheck className="h-3 w-3 text-primary" /> Signals are advisory. AI helps. You decide.
    </div>
  </section>
);

// --- Wallet overview -------------------------------------------------------

const WalletOverview = () => (
  <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-card">
    <header className="flex items-center justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Wallet</p>
        <h2 className="mt-0.5 text-[17px] font-semibold tracking-tight">€1,420 available</h2>
      </div>
      <Button asChild variant="ghost" size="sm"><Link to="/wallet">Open <ChevronRight className="h-3.5 w-3.5" /></Link></Button>
    </header>

    <div className="mt-4 grid grid-cols-3 gap-2.5">
      <MiniStat label="Trip credit" value="€980" tone="primary" />
      <MiniStat label="Shared" value="€320" tone="accent" icon={<Users className="h-3 w-3" />} />
      <MiniStat label="Gifted" value="€120" tone="success" icon={<Gift className="h-3 w-3" />} />
    </div>

    <ul className="mt-4 divide-y divide-border/60 text-[12.5px]">
      <TxRow icon={<Plane className="h-3.5 w-3.5" />} label="KLM KL1693 · AMS→LIS" meta="14 Jul · applied" amount="−€1,172" />
      <TxRow icon={<RefreshCw className="h-3.5 w-3.5" />} label="Refund · KL2104 cancelled leg" meta="Pending · ~3 days" amount="+€186" tone="warning" />
      <TxRow icon={<Gift className="h-3.5 w-3.5" />} label="Gift from Sarah" meta="Birthday credit" amount="+€120" tone="success" />
    </ul>
  </section>
);

const MiniStat = ({ label, value, tone, icon }: { label: string; value: string; tone: "primary" | "accent" | "success"; icon?: React.ReactNode }) => {
  const bg =
    tone === "primary" ? "bg-[hsl(var(--primary-soft))] text-primary" :
    tone === "accent" ? "bg-[hsl(var(--accent-soft))] text-primary" :
    "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]";
  return (
    <div className={`rounded-xl px-3 py-2.5 ${bg}`}>
      <p className="flex items-center gap-1 text-[10.5px] uppercase tracking-wider font-semibold opacity-80">{icon} {label}</p>
      <p className="mt-0.5 text-[14px] font-semibold tabular-nums">{value}</p>
    </div>
  );
};

const TxRow = ({ icon, label, meta, amount, tone = "neutral" }: { icon: React.ReactNode; label: string; meta: string; amount: string; tone?: "neutral" | "success" | "warning" }) => {
  const c =
    tone === "success" ? "text-[hsl(var(--success))]" :
    tone === "warning" ? "text-[hsl(var(--warning))]" :
    "text-foreground";
  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-muted text-muted-foreground flex-shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="font-medium truncate">{label}</p>
          <p className="text-[11.5px] text-muted-foreground">{meta}</p>
        </div>
      </div>
      <span className={`font-semibold tabular-nums ${c}`}>{amount}</span>
    </li>
  );
};

// --- Notifications center --------------------------------------------------

const NOTIFS = [
  { icon: <DoorOpen className="h-3.5 w-3.5" />, tone: "primary" as const, text: "Gate D58 holding firm for KL1693 — confirmed ~3h before departure." },
  { icon: <CreditCard className="h-3.5 w-3.5" />, tone: "success" as const, text: "Refund of €186 approved for cancelled leg KL2104." },
  { icon: <Sparkles className="h-3.5 w-3.5" />, tone: "primary" as const, text: "Smoother return option found — TAP TP676 raises calm score by 6." },
];

const NotificationsCenter = () => (
  <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-card">
    <header className="flex items-center justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Notifications</p>
        <h2 className="mt-0.5 text-[17px] font-semibold tracking-tight">3 worth your attention</h2>
      </div>
      <Button asChild variant="ghost" size="sm"><Link to="/notifications">All <ChevronRight className="h-3.5 w-3.5" /></Link></Button>
    </header>
    <ul className="mt-4 space-y-2">
      {NOTIFS.map((n, i) => (
        <li key={i} className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5">
          <span className={`mt-0.5 grid h-7 w-7 place-items-center rounded-lg flex-shrink-0 ${
            n.tone === "success" ? "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]" : "bg-[hsl(var(--primary-soft))] text-primary"
          }`}>{n.icon}</span>
          <p className="text-[12.5px] leading-relaxed text-foreground/90">{n.text}</p>
        </li>
      ))}
    </ul>
  </section>
);

// --- Saved searches --------------------------------------------------------

const SAVED = [
  { route: "AMS → LIS", airline: "KLM / TAP", track: "Price watch", status: "−€42 vs avg", tone: "success" as const, icon: <TrendingDown className="h-3.5 w-3.5" /> },
  { route: "LHR → JFK", airline: "British Airways", track: "Calmer route", status: "Confidence rising", tone: "primary" as const, icon: <Sparkles className="h-3.5 w-3.5" /> },
  { route: "AMS → DXB", airline: "Emirates", track: "Q1 inventory", status: "+€88 vs avg", tone: "warning" as const, icon: <TrendingUp className="h-3.5 w-3.5" /> },
  { route: "CDG → BCN", airline: "Air France / Vueling", track: "Flexible dates", status: "3 calmer windows", tone: "primary" as const, icon: <Compass className="h-3.5 w-3.5" /> },
];

const SavedSearches = () => (
  <section className="rounded-2xl border border-border/70 bg-card p-5 md:p-6 shadow-card">
    <header className="flex items-center justify-between mb-4">
      <div>
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
          <Bookmark className="h-3 w-3" /> Saved searches
        </p>
        <h2 className="mt-0.5 text-[17px] font-semibold tracking-tight">Tracked routes & smart alerts</h2>
      </div>
      <Button asChild variant="ghost" size="sm"><Link to="/saved-searches">Open <ChevronRight className="h-3.5 w-3.5" /></Link></Button>
    </header>
    <div className="grid sm:grid-cols-2 gap-2.5">
      {SAVED.map((s) => (
        <article key={s.route} className="rounded-xl border border-border/60 bg-background/60 p-3.5 flex items-start gap-3">
          <span className={`grid h-8 w-8 place-items-center rounded-lg flex-shrink-0 ${
            s.tone === "success" ? "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]" :
            s.tone === "warning" ? "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]" :
            "bg-[hsl(var(--primary-soft))] text-primary"
          }`}>{s.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold tracking-tight tabular-nums">{s.route}</p>
            <p className="text-[11.5px] text-muted-foreground">{s.airline} · {s.track}</p>
            <p className={`mt-1.5 text-[12px] font-medium tabular-nums ${
              s.tone === "success" ? "text-[hsl(var(--success))]" :
              s.tone === "warning" ? "text-[hsl(var(--warning))]" :
              "text-primary"
            }`}>{s.status}</p>
          </div>
        </article>
      ))}
    </div>
    <Button asChild variant="ghost" size="sm" className="mt-3">
      <Link to="/search"><Plus className="h-3.5 w-3.5" /> Track a new route</Link>
    </Button>
  </section>
);

// --- Travel profile card ---------------------------------------------------

const TravelProfileCard = () => (
  <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-card">
    <header className="flex items-center justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Travel profile</p>
        <h2 className="mt-0.5 text-[17px] font-semibold tracking-tight">Preferences & status</h2>
      </div>
      <Button asChild variant="ghost" size="sm"><Link to="/profile">Edit <ChevronRight className="h-3.5 w-3.5" /></Link></Button>
    </header>

    <dl className="mt-4 grid grid-cols-2 gap-2.5 text-[12.5px]">
      <ProfileRow label="Loyalty" value="Flying Blue · Gold" />
      <ProfileRow label="Preferred airline" value="KLM / TAP" />
      <ProfileRow label="Seat" value="Window · forward" />
      <ProfileRow label="Travel style" value="Calm · low-stress" />
      <ProfileRow label="Passport" value="Valid until 2031" tone="success" />
      <ProfileRow label="Visa" value="Schengen · OK" tone="success" />
    </dl>

    <div className="mt-4 rounded-xl bg-[hsl(var(--primary-soft))]/60 px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-primary">
        <CircleDot className="h-3 w-3" /> Known traveler
      </p>
      <p className="mt-1 text-[12px] text-foreground/80 leading-relaxed">
        TSA PreCheck on file. Travixis pre-fills it on every eligible itinerary.
      </p>
    </div>
  </section>
);

const ProfileRow = ({ label, value, tone }: { label: string; value: string; tone?: "success" }) => (
  <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
    <dt className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</dt>
    <dd className={`mt-0.5 font-medium ${tone === "success" ? "text-[hsl(var(--success))]" : "text-foreground"}`}>{value}</dd>
  </div>
);

export default DashboardPage;
