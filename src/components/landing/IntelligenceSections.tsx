import {
  CalendarDays,
  TrendingUp,
  Compass,
  Bell,
  ShieldCheck,
  Sparkles,
  Plane,
  Sun,
  Cloud,
  Briefcase,
  Globe2,
  Clock,
  Gauge,
  Wallet,
  AlertTriangle,
  Eye,
  Layers,
  Map,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BadgeSoft } from "@/components/BadgeSoft";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────────
   1. Smart Travel Calendar Preview
   ──────────────────────────────────────────────── */
type DayKind = "value" | "cheap" | "risk" | "peak" | "balance" | "none";

const calendar: { d: number; kind: DayKind; label?: string }[] = (() => {
  const pattern: DayKind[] = [
    "none","none","cheap","value","balance","peak","peak",
    "value","cheap","value","balance","value","peak","peak",
    "cheap","value","balance","value","value","risk","peak",
    "cheap","cheap","value","balance","value","peak","peak",
    "value","value",
  ];
  return pattern.map((kind, i) => ({ d: i + 1, kind }));
})();

const kindStyle: Record<DayKind, string> = {
  value: "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))] ring-1 ring-[hsl(var(--success))]/30",
  cheap: "bg-[hsl(var(--accent-soft))] text-primary ring-1 ring-[hsl(var(--accent))]/40",
  risk: "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning-foreground))] ring-1 ring-[hsl(var(--warning))]/40",
  peak: "bg-[hsl(var(--destructive-soft))] text-[hsl(var(--destructive))] ring-1 ring-[hsl(var(--destructive))]/30",
  balance: "bg-[hsl(var(--primary-soft))] text-primary ring-1 ring-primary/20",
  none: "bg-muted/40 text-muted-foreground",
};

export const SmartCalendarSection = () => (
  <section className="container py-20">
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
      <div>
        <BadgeSoft variant="primary"><CalendarDays className="h-3 w-3" /> Travel intelligence preview</BadgeSoft>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold">A calendar that thinks beyond price.</h2>
        <p className="mt-3 text-muted-foreground max-w-xl">
          See cheapest days, best overall value, weather confidence and disruption risk — all in one calm view.
          Pick the date that fits your life, not just your wallet.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 max-w-md text-sm">
          {[
            { kind: "value", label: "Best value" },
            { kind: "cheap", label: "Cheapest" },
            { kind: "balance", label: "Balanced" },
            { kind: "risk", label: "Higher risk" },
            { kind: "peak", label: "Peak pricing" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span className={`inline-block h-3.5 w-3.5 rounded ${kindStyle[l.kind as DayKind]}`} />
              <span className="text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 md:p-6 shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold">May 2026 · AMS → LIS</p>
          <span className="text-xs text-muted-foreground">Sample preview</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-[11px] text-center text-muted-foreground mb-2">
          {["M","T","W","T","F","S","S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {calendar.map((c, i) => (
            <div
              key={i}
              className={`aspect-square rounded-md grid place-items-center text-xs font-medium ${kindStyle[c.kind]}`}
              title={c.kind}
            >
              {c.d}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Scoring blends true price, airline reliability, weather confidence and connection stress.
        </p>
      </div>
    </div>
  </section>
);

/* ────────────────────────────────────────────────
   2. Trending Destinations
   ──────────────────────────────────────────────── */
const destinations = [
  { city: "Tokyo", country: "Japan", price: "€612", month: "Apr · May", duration: "13h 20m", confidence: 92, risk: "Low", tone: "from-[hsl(199_100%_56%/0.18)] to-[hsl(211_80%_22%/0.25)]" },
  { city: "Lisbon", country: "Portugal", price: "€118", month: "Mar · Oct", duration: "3h 05m", confidence: 95, risk: "Low", tone: "from-[hsl(38_92%_50%/0.18)] to-[hsl(199_100%_56%/0.20)]" },
  { city: "Bangkok", country: "Thailand", price: "€548", month: "Nov · Feb", duration: "11h 45m", confidence: 88, risk: "Medium", tone: "from-[hsl(142_71%_36%/0.18)] to-[hsl(199_100%_56%/0.18)]" },
  { city: "New York", country: "United States", price: "€389", month: "May · Sep", duration: "8h 10m", confidence: 90, risk: "Low", tone: "from-[hsl(211_80%_22%/0.20)] to-[hsl(199_100%_56%/0.18)]" },
  { city: "Cape Town", country: "South Africa", price: "€724", month: "Feb · Apr", duration: "12h 25m", confidence: 86, risk: "Medium", tone: "from-[hsl(38_92%_50%/0.20)] to-[hsl(0_73%_51%/0.15)]" },
  { city: "Bali", country: "Indonesia", price: "€689", month: "Apr · Oct", duration: "16h 10m", confidence: 84, risk: "Medium", tone: "from-[hsl(199_100%_56%/0.20)] to-[hsl(142_71%_36%/0.18)]" },
];

export const TrendingDestinationsSection = () => (
  <section className="bg-soft border-y">
    <div className="container py-20">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="max-w-xl">
          <BadgeSoft variant="accent"><TrendingUp className="h-3 w-3" /> Trending now</BadgeSoft>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold">Destinations travelers trust this season.</h2>
          <p className="mt-3 text-muted-foreground">Real average prices. Best months to go. Honest confidence scores.</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-primary">
          <Link to="/search">Explore all destinations <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {destinations.map((d) => (
          <article key={d.city} className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-base hover:-translate-y-0.5">
            <div className={`relative h-40 bg-gradient-to-br ${d.tone}`}>
              <div className="absolute inset-0 [background-image:radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:18px_18px] opacity-30" />
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-card/90 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-primary">
                <Plane className="h-3 w-3" /> avg {d.price}
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-primary">{d.city}</h3>
                  <p className="text-xs text-muted-foreground">{d.country}</p>
                </div>
                <BadgeSoft variant={d.risk === "Low" ? "success" : "warning"}>{d.risk} risk</BadgeSoft>
              </div>
            </div>
            <div className="p-4 grid grid-cols-3 gap-2 text-xs">
              <Stat icon={CalendarDays} label="Best month" value={d.month} />
              <Stat icon={Clock} label="Flight" value={d.duration} />
              <Stat icon={Gauge} label="Confidence" value={`${d.confidence}%`} />
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="rounded-lg bg-muted/40 p-2.5">
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Icon className="h-3 w-3" />
      <span className="text-[10px] uppercase tracking-wide font-semibold">{label}</span>
    </div>
    <p className="mt-1 font-medium text-foreground">{value}</p>
  </div>
);

/* ────────────────────────────────────────────────
   3. Explore Flexible Travel
   ──────────────────────────────────────────────── */
const flexible = [
  { icon: CalendarDays, title: "Best long weekends", desc: "Three-day escapes within 4 hours from you.", tag: "From €98" },
  { icon: Wallet, title: "Cheapest this month", desc: "Lowest true-price destinations right now.", tag: "From €74" },
  { icon: Sun, title: "Warm destinations now", desc: "20°C+ with low disruption risk.", tag: "Curated" },
  { icon: ShieldCheck, title: "Low-risk destinations", desc: "Strong reliability scores and stable weather.", tag: "Calm" },
  { icon: Briefcase, title: "Remote-work friendly", desc: "Fast Wi-Fi, time-zone fit and visa ease.", tag: "Workation" },
  { icon: Star, title: "Best value business class", desc: "Premium cabins ranked by true value.", tag: "Premium" },
];

export const FlexibleTravelSection = () => (
  <section className="container py-20">
    <div className="max-w-2xl">
      <BadgeSoft variant="primary"><Compass className="h-3 w-3" /> Inspiration</BadgeSoft>
      <h2 className="mt-4 text-3xl md:text-4xl font-bold">Explore flexible travel.</h2>
      <p className="mt-3 text-muted-foreground">When you're open to ideas, Travixis finds the smartest fit.</p>
    </div>
    <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {flexible.map((f) => (
        <button
          key={f.title}
          type="button"
          className="group text-left rounded-2xl border bg-card p-5 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-base"
        >
          <div className="flex items-start justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--accent-soft))] text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground">{f.tag}</span>
          </div>
          <h3 className="mt-4 font-semibold">{f.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
          <div className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-80 group-hover:opacity-100">
            Explore <ChevronRight className="h-4 w-4" />
          </div>
        </button>
      ))}
    </div>
  </section>
);

/* ────────────────────────────────────────────────
   4. Extra "Why Travixis" intelligence cards
   ──────────────────────────────────────────────── */
export const IntelligenceCapabilitiesSection = () => {
  const items = [
    { icon: AlertTriangle, title: "Delay risk analysis", desc: "Historical on-time performance per route, season and airline." },
    { icon: Eye, title: "Hidden fee detection", desc: "Baggage, seats, surcharges — surfaced before you book." },
    { icon: Gauge, title: "Airline reliability scoring", desc: "Cancellation, delay and complaint patterns scored honestly." },
    { icon: Layers, title: "Transfer stress analysis", desc: "Connection time, terminal change and rebooking exposure." },
    { icon: Map, title: "Airport quality scoring", desc: "Wait times, lounge access and transit ease per airport." },
    { icon: Cloud, title: "Weather disruption awareness", desc: "Seasonal volatility flagged for your travel window." },
    { icon: Wallet, title: "Baggage transparency", desc: "What's included, what's not — in plain numbers." },
    { icon: Sparkles, title: "Smart trip ranking", desc: "Best value, lowest stress or cheapest — your call." },
  ];
  return (
    <section className="bg-soft border-y">
      <div className="container py-20">
        <div className="max-w-2xl">
          <BadgeSoft variant="primary">Intelligence capabilities</BadgeSoft>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold">Eight engines working quietly for you.</h2>
          <p className="mt-3 text-muted-foreground">
            Every recommendation is the result of layered analysis — not a single price ranking.
          </p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((i) => (
            <div key={i.title} className="rounded-2xl border bg-card p-5 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-base">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
                <i.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-sm">{i.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────
   5. Trips Ecosystem Preview
   ──────────────────────────────────────────────── */
export const TripsEcosystemSection = () => {
  const items = [
    { icon: Map, title: "Saved trips", desc: "Pick up where you left off." },
    { icon: ShieldCheck, title: "Travel documents", desc: "Passports, visas and tickets, organized." },
    { icon: Bell, title: "Price alerts", desc: "Calm, intelligent — never spammy." },
    { icon: AlertTriangle, title: "Disruption alerts", desc: "Strikes, weather and delays, in advance." },
    { icon: Clock, title: "Trip timeline", desc: "Every leg, transfer and check-in in one view." },
    { icon: Plane, title: "Booking status", desc: "Confirmations, seats and tickets verified." },
    { icon: Sparkles, title: "Airline updates", desc: "Schedule changes explained in plain language." },
    { icon: CalendarDays, title: "Smart reminders", desc: "Check-in, baggage and transfer windows." },
  ];
  return (
    <section className="container py-20">
      <div className="max-w-2xl">
        <BadgeSoft variant="accent">Trips ecosystem</BadgeSoft>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold">Everything about your trip in one place.</h2>
        <p className="mt-3 text-muted-foreground">Travixis stays with you long after you book.</p>
      </div>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((i) => (
          <div key={i.title} className="rounded-xl border bg-card p-4 shadow-card transition-base hover:shadow-elevated">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[hsl(var(--accent-soft))] text-primary">
                <i.icon className="h-4 w-4" />
              </div>
              <p className="font-semibold text-sm">{i.title}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{i.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────
   6. Price Alerts Preview
   ──────────────────────────────────────────────── */
export const PriceAlertsSection = () => {
  const alerts = [
    { tone: "success", icon: TrendingUp, title: "Better route available", desc: "AMS → LIS via direct KLM, saves 1h 40m and €34." },
    { tone: "primary", icon: ShieldCheck, title: "Lower-risk option found", desc: "Same price, better on-time score (94% vs 81%)." },
    { tone: "accent", icon: Layers, title: "Better layover detected", desc: "2h 10m at MAD instead of 55m at CDG — much calmer." },
    { tone: "success", icon: Wallet, title: "Price improved for your dates", desc: "Down €58 on May 14 — still includes 23kg baggage." },
    { tone: "warning", icon: Cloud, title: "Weather risk increased", desc: "Storm window forecast May 9–11 — consider shifting dates." },
    { tone: "primary", icon: Sparkles, title: "New recommended itinerary", desc: "Smart Search found a better-value pairing for your trip." },
  ];
  const toneClass = (t: string) =>
    t === "success" ? "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]"
    : t === "warning" ? "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning-foreground))]"
    : t === "accent" ? "bg-[hsl(var(--accent-soft))] text-primary"
    : "bg-[hsl(var(--primary-soft))] text-primary";

  return (
    <section className="bg-soft border-y">
      <div className="container py-20 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
        <div>
          <BadgeSoft variant="primary"><Bell className="h-3 w-3" /> Intelligent alerts</BadgeSoft>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold">Alerts worth opening.</h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            Not just "price dropped." Travixis tells you when something genuinely better appears —
            and explains why it matters.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {alerts.map((a) => (
            <div key={a.title} className="rounded-2xl border bg-card p-4 shadow-card">
              <div className="flex items-start gap-3">
                <div className={`grid h-9 w-9 place-items-center rounded-lg ${toneClass(a.tone)}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{a.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────
   7. Trust & Transparency
   ──────────────────────────────────────────────── */
export const TransparencySection = () => {
  const pillars = [
    { title: "No hidden ranking manipulation", desc: "We don't sell top placements. Order reflects analysis, not ad spend." },
    { title: "Transparent scoring", desc: "Each option shows the factors and weights that produced its rank." },
    { title: "Explainable recommendations", desc: "Every '+', '!' and 'i' on a result links to a clear reason." },
    { title: "AI assists — you decide", desc: "Recommendations never auto-book. The final choice is always yours." },
    { title: "Pricing honesty", desc: "True total price first; itemized fees second. No bait pricing." },
    { title: "Tradeoff clarity", desc: "Cheapest is rarely best. We name the tradeoff, you choose the balance." },
  ];
  return (
    <section className="container py-20">
      <div className="max-w-2xl">
        <BadgeSoft variant="primary"><ShieldCheck className="h-3 w-3" /> Transparency</BadgeSoft>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold">How Travixis ranks trips.</h2>
        <p className="mt-3 text-muted-foreground">
          Travel intelligence only matters if you can trust it. Here's exactly how ours works.
        </p>
      </div>
      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pillars.map((p) => (
          <div key={p.title} className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[hsl(var(--primary-soft))] text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="mt-4 font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────
   8. Discovery / SEO blocks
   ──────────────────────────────────────────────── */
export const DiscoverySection = () => {
  const groups = [
    { title: "Popular routes", items: ["Amsterdam → Lisbon", "London → New York", "Paris → Tokyo", "Berlin → Bangkok", "Madrid → Bali", "Zurich → Cape Town"] },
    { title: "Cheapest destinations", items: ["Porto", "Krakow", "Sofia", "Tirana", "Marrakech", "Tbilisi"] },
    { title: "Best summer escapes", items: ["Santorini", "Mallorca", "Crete", "Algarve", "Sicily", "Ibiza"] },
    { title: "Best winter sun", items: ["Tenerife", "Madeira", "Cape Verde", "Dubai", "Phuket", "Zanzibar"] },
    { title: "Best city breaks", items: ["Lisbon", "Copenhagen", "Vienna", "Prague", "Budapest", "Edinburgh"] },
    { title: "Low-risk travel", items: ["Switzerland", "Japan", "Iceland", "Singapore", "Norway", "Portugal"] },
  ];
  return (
    <section className="bg-soft border-y">
      <div className="container py-20">
        <div className="max-w-2xl">
          <BadgeSoft variant="accent"><Globe2 className="h-3 w-3" /> Discover</BadgeSoft>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold">Where will you go next?</h2>
          <p className="mt-3 text-muted-foreground">Curated starting points — not a directory.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div key={g.title} className="rounded-2xl border bg-card p-6 shadow-card">
              <p className="text-sm font-semibold">{g.title}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {g.items.map((i) => (
                  <li key={i}>
                    <Link to="/search" className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 transition-base">
                      <ChevronRight className="h-3.5 w-3.5 opacity-60" /> {i}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
