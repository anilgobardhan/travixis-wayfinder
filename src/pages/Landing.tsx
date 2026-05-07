import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ShieldCheck,
  Sparkles,
  Search,
  ArrowRight,
  Plane,
  Hotel,
  Package,
  Wallet,
  Gauge,
  Wand2,
  Mic,
  MicOff,
  Loader2,
  Bell,
  FileText,
  Users,
  Sun,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeSoft } from "@/components/BadgeSoft";
import { ENABLE_REAL_SEARCH } from "@/lib/flags";
import { api } from "@/lib/api";
import { extractTripFields } from "@/lib/extractTripFields";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { AirportSelect } from "@/components/AirportSelect";
import type { Airport } from "@/lib/airports";
import { EnvDebugPanel } from "@/components/EnvDebugPanel";

const Landing = () => {
  const navigate = useNavigate();
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  const [voiceText, setVoiceText] = useState("");
  const voice = useVoiceInput();

  const travelersCount = Math.max(0, parseInt(travelers, 10) || 0);
  const canSearch =
    !!fromAirport && !!toAirport && !!depart && travelersCount >= 1 && !submitting;

  const onQuickSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSearch) return;

    const payload = {
      from: fromAirport!.iata,
      to: toAirport!.iata,
      departDate: depart,
      returnDate: ret || depart,
      travelers: travelersCount,
    };

    console.log("ENV CHECK", {
      ENABLE_REAL_SEARCH,
      VITE_ENABLE_REAL_SEARCH: import.meta.env.VITE_ENABLE_REAL_SEARCH,
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    });
    console.log("SEARCH PAYLOAD", payload);

    if (!ENABLE_REAL_SEARCH) {
      navigate(`/autopilot?offline=1&mode=quick`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.search(payload);
      const id = res?.searchId ?? res?.id;
      if (id) {
        try {
          sessionStorage.setItem("travixis:lastSearchId", id);
        } catch { /* noop */ }
        const qs = new URLSearchParams({
          from: "quick",
          id,
          origin: fromAirport!.iata,
          destination: toAirport!.iata,
          departDate: depart,
          returnDate: ret || depart,
          travelers: String(travelersCount),
        }).toString();
        navigate(`/results?${qs}`);
      } else {
        toast.warning("Search did not return an id — showing preview mode.");
        navigate(`/autopilot?offline=1&mode=quick`);
      }
    } catch (error) {
      console.error("SEARCH FAILED", error);
      toast.warning("Backend unreachable — showing preview mode.");
      navigate(`/autopilot?offline=1&mode=quick`);
    } finally {
      setSubmitting(false);
    }
  };

  const goAutopilot = (text?: string) => {
    const q = (text ?? voiceText).trim();
    if (q) {
      extractTripFields(q);
      navigate(`/search?q=${encodeURIComponent(q)}&mode=autopilot`);
    } else {
      navigate(`/search?mode=autopilot`);
    }
  };

  const onVoiceClick = () => {
    if (!voice.supported) {
      toast.info("Voice search is not supported in this browser yet.");
      return;
    }
    if (voice.listening) {
      voice.stop();
      return;
    }
    setVoiceText("");
    voice.start((finalText) => setVoiceText(finalText));
  };

  return (
    <div>
      {/* ───────── 1. HERO ───────── */}
      <section className="relative overflow-hidden bg-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl">
            <BadgeSoft variant="accent" className="mb-5 bg-white/10 text-white">
              <Sparkles className="h-3 w-3" /> Travel Operating System · Smart Search
            </BadgeSoft>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05]">
              Search your way.
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/80 max-w-2xl">
              Search your way — type, describe, or speak your trip. Travixis compares routes, true total
              prices and stress — then explains the trade-offs so you can decide with confidence.
            </p>

            <div className="mt-8 inline-flex flex-wrap gap-1 rounded-xl bg-white/10 p-1 backdrop-blur">
              {[
                { icon: Plane, label: "Flights", active: true },
                { icon: Hotel, label: "Hotels" },
                { icon: Package, label: "Packages" },
                { icon: ArrowRight, label: "Multi-city" },
              ].map((t) => (
                <span
                  key={t.label}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-base ${
                    t.active ? "bg-white text-primary font-medium shadow-sm" : "text-white/80 hover:text-white"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" /> {t.label}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Lowest disruption risk",
                "Best overall value",
                "No hidden baggage fees",
                "Shortest total travel time",
                "Smart layover balance",
              ].map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/85 backdrop-blur"
                >
                  <Sparkles className="h-3 w-3 opacity-70" /> {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search entry: Quick / Smart / Voice */}
      <section className="container -mt-10 relative z-10">
        <div className="rounded-2xl bg-card p-5 md:p-6 shadow-elevated border">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="inline-flex flex-wrap rounded-xl border bg-muted/40 p-1">
              <span className="inline-flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 text-sm font-medium shadow-sm">
                <Search className="h-4 w-4 text-primary" /> 🔍 Quick Search
              </span>
              <Link
                to="/search?mode=autopilot"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-base"
              >
                <Wand2 className="h-4 w-4" /> ✨ Smart Search
              </Link>
              <button
                type="button"
                onClick={onVoiceClick}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-base"
              >
                {voice.listening ? <MicOff className="h-4 w-4 text-[hsl(var(--accent))]" /> : <Mic className="h-4 w-4" />}
                🎤 Voice Search
              </button>
            </div>
            <p className="text-xs text-muted-foreground hidden md:block">
              Search your way — type, describe, or speak your trip.
            </p>
          </div>

          <form onSubmit={onQuickSearch} className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3">
              <AirportSelect label="From" value={fromAirport} onChange={setFromAirport} placeholder="Search city or airport" />
              <AirportSelect label="To" value={toAirport} onChange={setToAirport} placeholder="Search city or airport" />
              <FieldInput label="Departure" type="date" value={depart} onChange={setDepart} />
              <FieldInput label="Return" type="date" value={ret} onChange={setRet} />
              <FieldInput label="Travelers" type="number" value={travelers} onChange={setTravelers} placeholder="1" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="md:w-auto w-full md:self-end" disabled={!canSearch}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {submitting ? "Searching…" : "Search with Travixis"}
            </Button>
          </form>
          {!canSearch && !submitting && (
            <p className="mt-3 text-xs text-muted-foreground">
              Select your airports and travel date to search.
            </p>
          )}

          {(voice.listening || voiceText) && (
            <div className="mt-5 rounded-xl border bg-[hsl(var(--accent-soft))]/40 p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-card text-primary shrink-0">
                  <Mic className={voice.listening ? "h-4 w-4 animate-pulse text-[hsl(var(--accent))]" : "h-4 w-4"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    {voice.listening ? "Listening…" : "Voice transcript"}
                  </p>
                  <Input
                    value={voiceText}
                    onChange={(e) => setVoiceText(e.target.value)}
                    placeholder="Speak your trip — e.g. From Amsterdam to Lisbon next Friday for 2 adults."
                    className="mt-2 h-10"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" variant="cta" size="sm" onClick={() => goAutopilot()} disabled={!voiceText.trim()}>
                      <Sparkles className="h-4 w-4" /> Send to Smart Search
                    </Button>
                    {voice.listening ? (
                      <Button type="button" variant="outline" size="sm" onClick={voice.stop}>
                        <MicOff className="h-4 w-4" /> Stop
                      </Button>
                    ) : (
                      <Button type="button" variant="ghost" size="sm" onClick={onVoiceClick}>
                        <Mic className="h-4 w-4" /> Record again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Wand2 className="h-3.5 w-3.5" /> Prefer to describe it?
            </span>
            <Link to="/search?mode=autopilot" className="text-primary font-medium hover:underline">
              Try Smart Search →
            </Link>
            <span className="mx-1 opacity-40">·</span>
            <button type="button" onClick={onVoiceClick} className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline">
              <Mic className="h-3.5 w-3.5" /> Speak your trip
            </button>
            {!voice.supported && (
              <span className="text-[11px] text-muted-foreground/80">(voice not supported in this browser yet)</span>
            )}
          </div>
        </div>
      </section>

      {/* ───────── 2. WHY TRAVIXIS — 3 cards, calmer ───────── */}
      <section className="container py-24">
        <div className="max-w-2xl">
          <BadgeSoft variant="primary">Why Travixis</BadgeSoft>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold">
            Built for travelers who want clarity, not surprises.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every option is scored, explained, and priced honestly — so you can choose with confidence.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Wallet,
              title: "True total price",
              desc: "Includes baggage, taxes, seat fees and surcharges. The price you see is the price you pay.",
            },
            {
              icon: Gauge,
              title: "Risk & stress clarity",
              desc: "Tight connections, overnight transfers and cancellation risk explained in plain language.",
            },
            {
              icon: Sparkles,
              title: "Explainable recommendations",
              desc: "Why this option? Why this price? You always see the reasoning behind every suggestion.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-7 shadow-card transition-base hover:shadow-elevated hover:-translate-y-0.5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── 3. AI HELPS YOU DECIDE — signature section ───────── */}
      <section className="bg-soft border-y">
        <div className="container py-24 md:py-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <BadgeSoft variant="primary"><ShieldCheck className="h-3 w-3" /> Our principles</BadgeSoft>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">AI helps.<br/>You decide.</h2>
              <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
                Travixis surfaces the best options for you — but every choice stays in your hands.
                We never hide trade-offs, and every recommendation comes with a reason.
              </p>
              <ul className="mt-7 space-y-3 text-sm">
                {[
                  "True Price — what you see is what you pay",
                  "Risk — stress and reliability scored honestly",
                  "Explainability — every recommendation has a reason",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl border bg-card p-7 md:p-8 shadow-elevated">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Explainable recommendation</p>
                <h3 className="mt-2 text-xl font-semibold">Why we recommend Option A over B</h3>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border bg-[hsl(var(--success-soft))]/40 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-primary">Option A</p>
                      <BadgeSoft variant="success">Recommended</BadgeSoft>
                    </div>
                    <ul className="mt-4 space-y-2.5 text-xs">
                      <li className="flex gap-2 items-start"><BadgeSoft variant="success">+</BadgeSoft> Best overall value</li>
                      <li className="flex gap-2 items-start"><BadgeSoft variant="success">+</BadgeSoft> Reliable airline (94%)</li>
                      <li className="flex gap-2 items-start"><BadgeSoft variant="success">+</BadgeSoft> Carry-on included</li>
                      <li className="flex gap-2 items-start"><BadgeSoft variant="primary">i</BadgeSoft> Better arrival timing</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-muted-foreground">Option B</p>
                      <BadgeSoft variant="warning">Tradeoffs</BadgeSoft>
                    </div>
                    <ul className="mt-4 space-y-2.5 text-xs">
                      <li className="flex gap-2 items-start"><BadgeSoft variant="success">+</BadgeSoft> €18 cheaper</li>
                      <li className="flex gap-2 items-start"><BadgeSoft variant="warning">!</BadgeSoft> 55-min layover at CDG</li>
                      <li className="flex gap-2 items-start"><BadgeSoft variant="warning">!</BadgeSoft> Higher cancellation rate</li>
                      <li className="flex gap-2 items-start"><BadgeSoft variant="warning">!</BadgeSoft> Baggage not included</li>
                    </ul>
                  </div>
                </div>
                <Button asChild variant="soft" className="mt-6 w-full">
                  <Link to="/results">See a real example <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 4. SMART DISCOVERY — 3 curated cards ───────── */}
      <section className="container py-24">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-xl">
            <BadgeSoft variant="accent"><Sparkles className="h-3 w-3" /> Smart discovery</BadgeSoft>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">A few ideas, intelligently curated.</h2>
            <p className="mt-3 text-muted-foreground">
              Hand-picked travel directions based on reliability, value and time of year.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link to="/search">Explore more <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              tag: "Low risk",
              title: "Calm destinations this season",
              desc: "Strong reliability scores, stable weather, minimal disruption history.",
              tone: "from-[hsl(199_100%_56%/0.18)] to-[hsl(211_80%_22%/0.20)]",
            },
            {
              icon: Sun,
              tag: "Spring 2026",
              title: "Best spring escapes",
              desc: "Warm enough, quiet enough, priced right — before peak season hits.",
              tone: "from-[hsl(38_92%_50%/0.18)] to-[hsl(199_100%_56%/0.18)]",
            },
            {
              icon: Briefcase,
              tag: "Workation",
              title: "Remote-work friendly",
              desc: "Fast Wi-Fi, time-zone fit and visa ease — work from anywhere comfortably.",
              tone: "from-[hsl(142_71%_36%/0.18)] to-[hsl(199_100%_56%/0.18)]",
            },
          ].map((c) => (
            <article key={c.title} className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-base hover:-translate-y-0.5">
              <div className={`relative h-36 bg-gradient-to-br ${c.tone}`}>
                <div className="absolute inset-0 [background-image:radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:18px_18px] opacity-30" />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-card/90 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-primary">
                  <c.icon className="h-3 w-3" /> {c.tag}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───────── 5. TRIP + WALLET ECOSYSTEM — unified preview ───────── */}
      <section className="bg-soft border-y">
        <div className="container py-24">
          <div className="max-w-2xl">
            <BadgeSoft variant="primary"><LayoutIcon /> One ecosystem</BadgeSoft>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">Your trip stays managed.</h2>
            <p className="mt-3 text-muted-foreground">
              Wallet, alerts, documents and shared funding — quietly connected, so nothing slips through the cracks.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-12 gap-6">
            {/* Wallet card — featured */}
            <div className="lg:col-span-7 rounded-3xl border bg-card p-7 shadow-elevated">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Travel Wallet</p>
                    <p className="text-sm font-medium">Available balance</p>
                  </div>
                </div>
                <BadgeSoft variant="success">Active</BadgeSoft>
              </div>
              <div className="mt-6 flex items-baseline gap-3">
                <p className="text-4xl md:text-5xl font-bold tracking-tight">€1,420</p>
                <p className="text-sm text-muted-foreground">across 5 categories</p>
              </div>
              <div className="mt-5 grid grid-cols-5 gap-2 text-[11px]">
                {[
                  { l: "Flights", v: "€640" },
                  { l: "Hotels", v: "€420" },
                  { l: "Rail", v: "€140" },
                  { l: "Cars", v: "€120" },
                  { l: "Misc", v: "€100" },
                ].map((c) => (
                  <div key={c.l} className="rounded-lg bg-muted/50 p-2.5">
                    <p className="text-muted-foreground">{c.l}</p>
                    <p className="mt-1 font-semibold text-foreground">{c.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border bg-[hsl(var(--accent-soft))]/30 p-4 text-sm">
                <p className="font-medium">Smart coverage</p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Enough credits for 3 nights in Rome or a return flight to Lisbon.
                </p>
              </div>
            </div>

            {/* Compact ecosystem cards */}
            <div className="lg:col-span-5 grid gap-4">
              <EcoCard
                icon={Bell}
                title="Smart alerts"
                desc="Better itinerary detected · €38 lower true price for the same trip."
              />
              <EcoCard
                icon={FileText}
                title="Documents"
                desc="Boarding pass, hotel and visa in one calm timeline."
              />
              <EcoCard
                icon={Users}
                title="Shared funding"
                desc="Pool credits with travel companions — fair, transparent, automatic."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 6. FINAL CTA ───────── */}
      <section className="container py-20">
        <div className="rounded-3xl bg-hero p-10 md:p-14 text-primary-foreground text-center shadow-elevated">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to plan a calmer trip?</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Start a search and let Travixis show you the true cost, the real risks, and the best fit for you.
          </p>
          <Button asChild variant="cta" size="xl" className="mt-6">
            <Link to="/search">Start searching <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
      <EnvDebugPanel />
    </div>
  );
};

const LayoutIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const EcoCard = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <div className="rounded-2xl border bg-card p-5 shadow-card hover:shadow-elevated transition-base">
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
);

const FieldInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div className="rounded-lg bg-muted/40 px-3 py-2">
    <Label className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
      {label}
    </Label>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-medium"
    />
  </div>
);

export default Landing;
