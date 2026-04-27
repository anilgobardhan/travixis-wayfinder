import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ShieldCheck,
  Sparkles,
  Search,
  GitCompare,
  CheckCircle2,
  LayoutDashboard,
  ArrowRight,
  Plane,
  Hotel,
  Car,
  Package,
  Wallet,
  Gauge,
  MessageCircle,
  Wand2,
  Mic,
  MicOff,
  Loader2,
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
      mode: "quick" as const,
      from: fromAirport!.iata,
      to: toAirport!.iata,
      departDate: depart, // YYYY-MM-DD
      returnDate: ret || undefined,
      travelers: travelersCount,
    };

    // Debug: surface env + flag state so we can see why a request may be skipped.
    console.log("ENV CHECK", {
      ENABLE_REAL_SEARCH,
      VITE_ENABLE_REAL_SEARCH: import.meta.env.VITE_ENABLE_REAL_SEARCH,
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    });
    console.log("SEARCH PAYLOAD", payload);

    if (!ENABLE_REAL_SEARCH) {
      console.warn(
        "SEARCH SKIPPED — ENABLE_REAL_SEARCH is false. Set VITE_ENABLE_REAL_SEARCH=true and VITE_API_BASE_URL in Vercel."
      );
      navigate(`/autopilot?offline=1&mode=quick`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.search(payload);
      console.log("SEARCH RESPONSE", res);
      const id = res?.id;
      if (id) {
        try {
          sessionStorage.setItem("travixis:lastSearchId", id);
        } catch { /* noop */ }
        navigate(`/autopilot?id=${encodeURIComponent(id)}&mode=quick`);
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
      // Pre-extract just to validate; SearchPage will own the real submit.
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
      {/* Hero */}
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

            {/* Trip type chips */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { icon: Plane, label: "Flights" },
                { icon: Hotel, label: "Hotels" },
                { icon: Package, label: "Packages" },
                { icon: Car, label: "Cars" },
              ].map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm backdrop-blur"
                >
                  <t.icon className="h-3.5 w-3.5" /> {t.label}
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

      {/* Trust */}
      <section className="container py-20">
        <div className="max-w-2xl">
          <BadgeSoft variant="primary">Why Travixis</BadgeSoft>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold">
            Built for travelers who want clarity, not surprises.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every option is scored, explained, and priced honestly — so you can choose with confidence.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Wallet,
              title: "True total price",
              desc: "Includes baggage, taxes, seat fees and surcharges. The price you see is the price you pay.",
            },
            {
              icon: Gauge,
              title: "Risk & stress score",
              desc: "Tight connections, overnight transfers and cancellation risk explained in plain language.",
            },
            {
              icon: Sparkles,
              title: "Clear explanations",
              desc: "Why this option? Why this price? You always know the reasoning behind a recommendation.",
            },
            {
              icon: MessageCircle,
              title: "Post-booking support",
              desc: "Disruptions, rebookings, documents — your trip stays managed long after you book.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-card transition-base hover:shadow-elevated hover:-translate-y-0.5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-soft border-y">
        <div className="container py-20">
          <div className="text-center max-w-2xl mx-auto">
            <BadgeSoft variant="accent">How it works</BadgeSoft>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">From idea to managed trip in four steps</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            {[
              { icon: Search, title: "Search", desc: "Tell us where, when and what matters most." },
              { icon: GitCompare, title: "Compare", desc: "See real prices, real risks, real trade-offs." },
              { icon: CheckCircle2, title: "Choose", desc: "Pick best value, lowest stress or cheapest." },
              { icon: LayoutDashboard, title: "Manage", desc: "Documents, check-ins and disruptions in one place." },
            ].map((s, i) => (
              <div key={s.title} className="relative rounded-2xl bg-card p-6 border shadow-card">
                <span className="absolute -top-3 left-6 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <s.icon className="h-6 w-6 text-[hsl(var(--accent))]" />
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="container py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <BadgeSoft variant="primary"><ShieldCheck className="h-3 w-3" /> Our principles</BadgeSoft>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">AI helps. You decide.</h2>
            <p className="mt-3 text-muted-foreground">
              Travixis uses optimization and explainability engines to surface the best options for you —
              but every choice stays in your hands. We never hide trade-offs.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "True Price Engine — what you see is what you pay",
                "Risk Engine — stress and reliability scored honestly",
                "Optimizer — best value, lowest stress, cheapest",
                "Explainability — every recommendation has a reason",
                "Persistent platform — value continues after booking",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-elevated">
            <p className="text-xs font-medium text-muted-foreground">EXAMPLE EXPLANATION</p>
            <h3 className="mt-2 text-lg font-semibold">Why we recommend this flight</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <BadgeSoft variant="success">+</BadgeSoft>
                Direct flight, low disruption risk
              </li>
              <li className="flex items-start gap-3">
                <BadgeSoft variant="success">+</BadgeSoft>
                Total price includes 23kg baggage
              </li>
              <li className="flex items-start gap-3">
                <BadgeSoft variant="warning">!</BadgeSoft>
                Departure at 06:15 — early morning
              </li>
              <li className="flex items-start gap-3">
                <BadgeSoft variant="primary">i</BadgeSoft>
                Refundable up to 24h before departure
              </li>
            </ul>
            <Button asChild variant="soft" className="mt-6 w-full">
              <Link to="/results">See a real example</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container pb-20">
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
    </div>
  );
};

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
