import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ShieldCheck,
  Sparkles,
  Search,
  ArrowRight,
  ArrowLeftRight,
  Plane,
  Hotel,
  Package,
  Car,
  TrainFront,
  Wallet,
  Gauge,
  Wand2,
  Mic,
  MicOff,
  Loader2,
  Bell,
  FileText,
  Users,
  Gift,
  Sun,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";
import { BadgeSoft } from "@/components/BadgeSoft";
import { ENABLE_REAL_SEARCH } from "@/lib/flags";
import { api } from "@/lib/api";
import { extractTripFields } from "@/lib/extractTripFields";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { AirportSelect } from "@/components/AirportSelect";
import type { Airport } from "@/lib/airports";
import { EnvDebugPanel } from "@/components/EnvDebugPanel";
import discoverCalm from "@/assets/discover-calm.jpg";
import discoverSpring from "@/assets/discover-spring.jpg";
import discoverWorkation from "@/assets/discover-workation.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState<number[]>([]); // ages
  const [infants, setInfants] = useState(0);
  const [cabin, setCabin] = useState("Economy");
  const [paxOpen, setPaxOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [voiceText, setVoiceText] = useState("");
  const voice = useVoiceInput();

  const travelersCount = adults + children.length + infants;
  const updateChildren = (next: number) => {
    setChildren((prev) => {
      if (next > prev.length) return [...prev, ...Array(next - prev.length).fill(6)];
      return prev.slice(0, Math.max(0, next));
    });
  };
  const travelersSummary = (() => {
    const parts: string[] = [];
    parts.push(`${adults} ${adults === 1 ? "Adult" : "Adults"}`);
    if (children.length) parts.push(`${children.length} ${children.length === 1 ? "Child" : "Children"}`);
    if (infants) parts.push(`${infants} ${infants === 1 ? "Infant" : "Infants"}`);
    return `${parts.join(" · ")} · ${cabin}`;
  })();
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
          type: "flights",
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
        <div className="absolute inset-0 hero-dots pointer-events-none" aria-hidden />
        <div className="container relative pt-6 pb-20 md:pt-8 md:pb-28">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 max-w-[44rem]">
            <BadgeSoft variant="accent" className="mb-7 bg-white/10 text-white">
              <Sparkles className="h-3 w-3" /> Travel Operating System · Smart Search
            </BadgeSoft>
            <h1 className="text-[2.75rem] md:text-[4.25rem] font-semibold leading-[1.02] tracking-[-0.025em]">
              Search your way.
            </h1>
            <p className="mt-6 text-[17px] md:text-[19px] text-white/75 max-w-[36rem] leading-[1.65] font-light">
              Type, describe, or speak your trip. Travixis compares routes, true total
              prices and stress — then explains the trade-offs so you can decide with confidence.
            </p>

            <div className="mt-10 inline-flex flex-wrap gap-1 rounded-xl bg-white/10 p-1 backdrop-blur">
              {[
                { icon: Plane, label: "Flights", active: true },
                { icon: Hotel, label: "Hotels" },
                { icon: Car, label: "Cars" },
                { icon: TrainFront, label: "Rail" },
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

            {/* Live intelligence micro-signals */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-white/70">
              {[
                { dot: "bg-[hsl(var(--success))]", label: "23 low-stress routes this week" },
                { dot: "bg-white/70", label: "Portugal weather confidence high" },
                { dot: "bg-[hsl(var(--success))]", label: "Wallet covers 82% of Lisbon trip" },
                { dot: "bg-white/70", label: "Rail demand lower this Tuesday" },
              ].map((s) => (
                <span key={s.label} className="inline-flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Lowest disruption risk",
                "Best overall value",
                "No hidden baggage fees",
                "Shortest total travel time",
                "Smart layover balance",
              ].map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-white/80 backdrop-blur"
                >
                  <Sparkles className="h-3 w-3 opacity-70" /> {c}
                </span>
              ))}
            </div>
            </div>

            {/* Floating intelligence panel — Apple/Notion AI feel */}
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="rounded-[20px] bg-white/[0.05] backdrop-blur-xl ring-1 ring-white/10 p-7 shadow-[0_30px_80px_-32px_rgba(0,0,0,0.55)]">
                <div className="flex items-center gap-2.5 text-white/85">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.08] ring-1 ring-white/10">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-[10.5px] uppercase tracking-[0.14em] font-medium text-white/60">Travixis intelligence</p>
                </div>
                <p className="mt-6 text-[14.5px] leading-[1.6] text-white/90 font-light">
                  AI detected a <span className="font-medium text-white">lower-stress departure window</span> Tue–Wed for AMS&nbsp;→&nbsp;LIS.
                </p>
                <div className="mt-6 space-y-3.5">
                  {[
                    { dot: "bg-[hsl(var(--success))]", label: "Wallet can cover 82% of this route" },
                    { dot: "bg-white/60", label: "Best historical week to travel" },
                    { dot: "bg-[hsl(var(--success))]", label: "Reliability above seasonal average" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2.5 text-[12.5px] text-white/80 leading-relaxed">
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-7 pt-5 border-t border-white/[0.08] flex items-center justify-between text-[10.5px] text-white/55 tracking-wide">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="relative grid h-2 w-2 place-items-center">
                      <span className="absolute inset-0 rounded-full bg-[hsl(var(--success))]/40 ambient-pulse" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
                    </span>
                    Live signals
                  </span>
                  <span>Updated just now</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Search entry: Quick / Smart / Voice */}
      <section className="container -mt-6 relative z-10">
        <div className="mx-auto max-w-[94%] md:max-w-[92%] rounded-2xl bg-card p-5 md:p-6 shadow-[0_24px_60px_-28px_hsl(var(--primary)/0.35),0_8px_24px_-12px_hsl(var(--foreground)/0.08)] border border-border/70 ring-1 ring-foreground/[0.03]">
          {/* Mode tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="inline-flex flex-wrap items-center rounded-xl border bg-muted/40 p-1">
              <span className="inline-flex items-center gap-2 rounded-lg bg-card px-3.5 py-1.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-border/60">
                <Search className="h-4 w-4 text-primary" /> Quick Search
              </span>
              <Link
                to="/search?mode=autopilot"
                className="inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-base"
              >
                <Wand2 className="h-4 w-4" /> Smart Search
              </Link>
              <button
                type="button"
                onClick={onVoiceClick}
                className="inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-base"
              >
                {voice.listening ? <MicOff className="h-4 w-4 text-[hsl(var(--accent))]" /> : <Mic className="h-4 w-4" />}
                Voice Search
              </button>
            </div>
            <p className="text-xs text-muted-foreground hidden md:block">
              Search your way — type, describe, or speak your trip.
            </p>
          </div>

          <form onSubmit={onQuickSearch} className="space-y-3">
            {/* Cluster row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
              {/* Route cluster */}
              <div className="md:col-span-5 relative rounded-xl border bg-muted/30 p-1 grid grid-cols-2 gap-1 field-cluster">
                <div className="rounded-lg bg-card px-3 py-2 ring-1 ring-border/50 transition-premium hover:ring-primary/20">
                  <AirportSelect label="From" value={fromAirport} onChange={setFromAirport} placeholder="City or airport" />
                </div>
                <div className="rounded-lg bg-card px-3 py-2 ring-1 ring-border/50 transition-premium hover:ring-primary/20">
                  <AirportSelect label="To" value={toAirport} onChange={setToAirport} placeholder="City or airport" />
                </div>
                <button
                  type="button"
                  onClick={() => { const a = fromAirport; setFromAirport(toAirport); setToAirport(a); }}
                  aria-label="Swap origin and destination"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-card text-primary border shadow-sm hover:bg-[hsl(var(--primary-soft))] hover:rotate-180 transition-premium"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </button>
              </div>

              {/* Dates cluster */}
              <div className="md:col-span-4 rounded-xl border bg-muted/30 p-1 grid grid-cols-2 gap-1 field-cluster">
                <div className="rounded-lg bg-card px-3 py-2 ring-1 ring-border/50 transition-premium hover:ring-primary/20">
                  <FieldInput label="Departure" type="date" value={depart} onChange={setDepart} />
                </div>
                <div className="rounded-lg bg-card px-3 py-2 ring-1 ring-border/50 transition-premium hover:ring-primary/20">
                  <FieldInput label="Return" type="date" value={ret} onChange={setRet} />
                </div>
              </div>

              {/* Travelers + Class cluster */}
              <div className="md:col-span-3 rounded-xl border bg-muted/30 p-1 field-cluster">
                <Popover open={paxOpen} onOpenChange={setPaxOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full text-left rounded-lg bg-card px-3 py-2 ring-1 ring-border/50 h-full flex flex-col justify-center hover:bg-card/80 transition-base focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Label className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold cursor-pointer">
                        Travelers · Class
                      </Label>
                      <div className="mt-1 flex items-center gap-2 min-w-0">
                        <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-semibold text-foreground truncate">
                          {travelersSummary}
                        </span>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    sideOffset={10}
                    className="w-[20rem] p-0 rounded-2xl border bg-card shadow-[0_24px_60px_-28px_hsl(var(--primary)/0.35),0_8px_24px_-12px_hsl(var(--foreground)/0.08)]"
                  >
                    <div className="p-5 space-y-4">
                      <PaxRow
                        label="Adults"
                        sub="Aged 18+"
                        value={adults}
                        min={1}
                        max={9}
                        onChange={setAdults}
                      />
                      <PaxRow
                        label="Children"
                        sub="Aged 2–17"
                        value={children.length}
                        min={0}
                        max={6}
                        onChange={updateChildren}
                      />
                      {children.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 pl-1">
                          {children.map((age, i) => (
                            <Select
                              key={i}
                              value={String(age)}
                              onValueChange={(v) =>
                                setChildren((prev) => prev.map((a, idx) => (idx === i ? parseInt(v, 10) : a)))
                              }
                            >
                              <SelectTrigger className="h-9 text-xs">
                                <SelectValue placeholder={`Child ${i + 1} age`} />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 16 }, (_, n) => n + 2).map((n) => (
                                  <SelectItem key={n} value={String(n)}>
                                    {`Child ${i + 1} · ${n} yrs`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ))}
                        </div>
                      )}
                      <PaxRow
                        label="Infants"
                        sub="Under 2, on lap"
                        value={infants}
                        min={0}
                        max={Math.max(1, adults)}
                        onChange={setInfants}
                      />

                      <div className="pt-3 border-t">
                        <Label className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
                          Cabin class
                        </Label>
                        <div className="mt-2 grid grid-cols-2 gap-1.5">
                          {["Economy", "Premium Economy", "Business", "First"].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setCabin(c)}
                              className={`text-xs rounded-lg px-2.5 py-2 ring-1 transition-base ${
                                cabin === c
                                  ? "bg-[hsl(var(--primary-soft))] text-primary ring-primary/30 font-semibold"
                                  : "bg-muted/40 text-foreground/80 ring-border/60 hover:bg-muted"
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <Button type="button" size="sm" variant="outline" onClick={() => setPaxOpen(false)}>
                          Done
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* CTA + intelligence row */}
            <div className="flex flex-col-reverse md:flex-row md:items-center gap-3">
              <p className="flex-1 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary/70" />
                <span>
                  <span className="text-foreground/80 font-medium">Travixis intelligence:</span>{" "}
                  Flexible dates may reduce fares by ~18% on this route.
                </span>
              </p>
              <Button type="submit" variant="hero" size="lg" className="md:w-auto w-full px-7 gap-2.5" disabled={!canSearch}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="tracking-tight">{submitting ? "Searching…" : "Search with Travixis"}</span>
                {!submitting && <ArrowRight className="h-4 w-4 opacity-80" />}
              </Button>
            </div>
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

          <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
              image: discoverCalm,
            },
            {
              icon: Sun,
              tag: "Spring 2026",
              title: "Best spring escapes",
              desc: "Warm enough, quiet enough, priced right — before peak season hits.",
              image: discoverSpring,
            },
            {
              icon: Briefcase,
              tag: "Workation",
              title: "Remote-work friendly",
              desc: "Fast Wi-Fi, time-zone fit and visa ease — work from anywhere comfortably.",
              image: discoverWorkation,
            },
          ].map((c) => (
            <article key={c.title} className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-base hover:-translate-y-0.5">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={c.image}
                  alt=""
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-foreground/0 to-foreground/0" />
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

      {/* ───────── 5. TRAVEL WALLET + TRIP OPERATING SYSTEM ───────── */}
      <section className="bg-soft border-y">
        <div className="container py-24">
          <div className="max-w-2xl">
            <BadgeSoft variant="primary"><LayoutIcon /> Travel Operating System</BadgeSoft>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">Your trip stays managed.</h2>
            <p className="mt-3 text-muted-foreground">
              Travel wallet, gifted travel credits, documents, alerts and shared funding — connected in one calm travel system.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-12 gap-6">
            {/* LEFT — Travel Wallet preview */}
            <div className="lg:col-span-6 rounded-3xl border bg-card p-7 md:p-8 shadow-elevated">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Travel Wallet · Gifted Travel Credits</p>
                    <p className="text-sm font-medium">Universal travel balance</p>
                  </div>
                </div>
                <BadgeSoft variant="success">Active</BadgeSoft>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <p className="text-4xl md:text-5xl font-bold tracking-tight">€1,420</p>
                <p className="text-sm text-muted-foreground">unified balance</p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                {[
                  { l: "Flights", v: "€620" },
                  { l: "Hotels", v: "€410" },
                  { l: "Rail", v: "€180" },
                  { l: "Packages", v: "€140" },
                ].map((c) => (
                  <div key={c.l} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                    <span className="text-muted-foreground text-xs">{c.l}</span>
                    <span className="font-semibold text-foreground">{c.v}</span>
                  </div>
                ))}
              </div>

              <p className="mt-5 rounded-xl bg-[hsl(var(--primary-soft))]/60 px-4 py-3 text-xs text-primary">
                Use credits across flights, hotels, trains, packages and experiences.
              </p>
            </div>

            {/* RIGHT — Trip Operating System mini cards */}
            <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
              <EcoCard icon={Gift}     title="Gifted travel credits" desc="Send travel credits to friends, family or shared trips." />
              <EcoCard icon={Bell}     title="Smart alerts"          desc="Price drops and disruption changes explained clearly." />
              <EcoCard icon={FileText} title="Documents"             desc="Passports, tickets and confirmations organized." />
              <EcoCard icon={Users}    title="Shared funding"        desc="Family and group contributions stay transparent." />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild variant="hero" size="lg">
              <a href="#"><Gift className="h-4 w-4" /> Gift travel credit</a>
            </Button>
            <Button asChild variant="soft" size="lg">
              <a href="#">Explore wallet <ArrowRight className="h-4 w-4" /></a>
            </Button>
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
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-white/75">
            {[
              { icon: Wallet, label: "Wallet-aware pricing" },
              { icon: Sparkles, label: "AI travel intelligence" },
              { icon: Users, label: "Shared trip funding" },
              { icon: ShieldCheck, label: "Transparent travel scoring" },
            ].map((m) => (
              <li key={m.label} className="inline-flex items-center gap-1.5">
                <m.icon className="h-3.5 w-3.5 opacity-80" />
                {m.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── 7. TRUST STRIP ───────── */}
      <section className="border-t bg-card/50">
        <div className="container py-5">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {[
              "Transparent pricing",
              "Explainable AI",
              "Smart travel wallet",
              "Shared trip funding",
              "Disruption intelligence",
            ].map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-[hsl(var(--success))]" />
                  {t}
                </span>
                {i < 4 && <span className="opacity-30 hidden sm:inline">·</span>}
              </li>
            ))}
          </ul>
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

const PaxRow = ({
  label,
  sub,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sub: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) => {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  const btn = "grid h-8 w-8 place-items-center rounded-full border bg-card text-foreground/80 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-base";
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={dec} disabled={value <= min} className={btn} aria-label={`Decrease ${label}`}>
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-semibold tabular-nums">{value}</span>
        <button type="button" onClick={inc} disabled={value >= max} className={btn} aria-label={`Increase ${label}`}>
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Landing;
