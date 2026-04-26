import { Link } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeSoft } from "@/components/BadgeSoft";

const Landing = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl">
            <BadgeSoft variant="accent" className="mb-5 bg-white/10 text-white">
              <Sparkles className="h-3 w-3" /> Travel Operating System
            </BadgeSoft>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05]">
              Travel smarter with Travixis
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/80 max-w-2xl">
              Search, compare, understand, book and manage your trip in one place.
              No surprises. No fine print. Just clarity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="cta" size="xl">
                <Link to="/search">
                  Start searching <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="xl" className="text-white hover:bg-white/10">
                <Link to="/trip">See trip dashboard</Link>
              </Button>
            </div>

            {/* Trip type chips */}
            <div className="mt-10 flex flex-wrap gap-2">
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

      {/* Quick search teaser */}
      <section className="container -mt-10 relative z-10">
        <div className="rounded-2xl bg-card p-5 md:p-6 shadow-elevated border">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label="From" value="Amsterdam" />
              <Field label="To" value="Lisbon" />
              <Field label="Departure" value="Fri, 15 Aug" />
              <Field label="Travelers" value="2 adults" />
            </div>
            <Button asChild variant="hero" size="lg" className="md:w-auto w-full">
              <Link to="/search">
                Search with Travixis <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
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

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-muted/50 px-4 py-3">
    <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</p>
    <p className="mt-0.5 text-sm font-medium">{value}</p>
  </div>
);

export default Landing;
