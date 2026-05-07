import {
  Wallet,
  Plane,
  Hotel,
  Train,
  Package,
  Compass,
  Users,
  Heart,
  Briefcase,
  Cake,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  PiggyBank,
  Globe2,
  Layers,
  CarFront,
  Ship,
  Building2,
} from "lucide-react";
import { BadgeSoft } from "@/components/BadgeSoft";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

/* ───── 1. Travel Wallet ───── */
const balances = [
  { icon: Plane, label: "Flights", value: "€620", tone: "primary" },
  { icon: Hotel, label: "Hotels", value: "€410", tone: "accent" },
  { icon: Train, label: "Rail", value: "€180", tone: "primary" },
  { icon: Compass, label: "Experiences", value: "€140", tone: "accent" },
  { icon: Package, label: "Packages", value: "€70", tone: "primary" },
];

const toneBg = (t: string) =>
  t === "accent"
    ? "bg-[hsl(var(--accent-soft))] text-primary"
    : "bg-[hsl(var(--primary-soft))] text-primary";

export const TravelWalletSection = () => (
  <section className="container py-20">
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
      <div>
        <BadgeSoft variant="primary"><Wallet className="h-3 w-3" /> Travel wallet</BadgeSoft>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold">Your Travel Wallet.</h2>
        <p className="mt-3 text-muted-foreground max-w-xl">
          One balance for flights, hotels, trains, packages and experiences — no gift cards, no expiring coupons.
          Just smart travel credits that work across your entire journey.
        </p>

        <ul className="mt-6 space-y-2.5 text-sm">
          {[
            "Unified across every travel category",
            "Transparent usage — no hidden conversion fees",
            "Shareable with family, friends and teams",
            "Always explainable — you see exactly where it goes",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="hero" size="sm">
            Open my wallet <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="soft" size="sm">
            How travel credits work
          </Button>
        </div>
      </div>

      {/* Premium balance card */}
      <div className="rounded-3xl bg-hero p-8 text-primary-foreground shadow-elevated relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_80%_20%,white_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative">
          <p className="text-xs uppercase tracking-wide text-white/70">Available travel balance</p>
          <p className="mt-2 text-5xl font-bold tracking-tight">€1,420</p>
          <p className="mt-1 text-sm text-white/80">Across 5 travel categories · Refreshed today</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {balances.map((b) => (
              <div key={b.label} className="rounded-xl bg-white/10 backdrop-blur p-3">
                <b.icon className="h-4 w-4 text-white/85" />
                <p className="mt-2 text-[10px] uppercase tracking-wide text-white/70">{b.label}</p>
                <p className="mt-0.5 text-sm font-semibold">{b.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-white/10 backdrop-blur p-4 flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-white/85 shrink-0 mt-0.5" />
            <p className="text-sm text-white/90">
              Your balance can fully cover a <span className="font-semibold">3-night Lisbon weekend</span> for two.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ───── 2. Smart Booking Coverage ───── */
const coverage = [
  { icon: Plane, title: "Lisbon weekend trip", desc: "Your balance can fully cover flights + 2 hotel nights.", chip: "Fully covered" },
  { icon: Hotel, title: "3 hotel nights in Rome", desc: "Enough credits for a 4-star stay near Trastevere.", chip: "Eligible" },
  { icon: Train, title: "Paris ↔ Amsterdam rail", desc: "Wallet fully covers a return Eurostar booking.", chip: "Fully covered" },
  { icon: Package, title: "Tokyo package deal", desc: "Smart balance available for Tokyo bundle savings.", chip: "Best value" },
  { icon: Compass, title: "Bali day experiences", desc: "3 curated activities can be booked from credits.", chip: "Eligible" },
  { icon: Globe2, title: "Long-haul to NYC", desc: "Covers ~62% of the round-trip economy fare.", chip: "Partial" },
];

export const SmartCoverageSection = () => (
  <section className="bg-soft border-y">
    <div className="container py-20">
      <div className="max-w-2xl">
        <BadgeSoft variant="accent"><Sparkles className="h-3 w-3" /> Smart coverage</BadgeSoft>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold">What your balance can do today.</h2>
        <p className="mt-3 text-muted-foreground">
          Travixis matches your travel credits to real, available trips — in plain language.
        </p>
      </div>
      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coverage.map((c) => (
          <article key={c.title} className="rounded-2xl border bg-card p-5 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-base">
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <BadgeSoft variant={c.chip === "Fully covered" || c.chip === "Best value" ? "success" : c.chip === "Partial" ? "warning" : "primary"}>
                {c.chip}
              </BadgeSoft>
            </div>
            <h3 className="mt-4 font-semibold">{c.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ───── 3. Shared Travel Funding ───── */
const fundingTypes = [
  { icon: Heart, title: "Honeymoon fund", desc: "Loved ones contribute to your dream trip.", progress: 72, raised: "€2,160", goal: "€3,000" },
  { icon: Users, title: "Family vacation", desc: "Plan together, fund together — transparently.", progress: 45, raised: "€1,800", goal: "€4,000" },
  { icon: Briefcase, title: "Team travel pool", desc: "Company-wide credits for offsites and trips.", progress: 88, raised: "€7,040", goal: "€8,000" },
  { icon: Cake, title: "Birthday escape", desc: "Friends pitch in for the perfect getaway.", progress: 30, raised: "€450", goal: "€1,500" },
  { icon: Globe2, title: "Group adventure", desc: "Shared funding for multi-traveler trips.", progress: 56, raised: "€2,800", goal: "€5,000" },
  { icon: PiggyBank, title: "Personal travel goal", desc: "Save toward a future trip on your own terms.", progress: 18, raised: "€540", goal: "€3,000" },
];

export const SharedFundingSection = () => (
  <section className="container py-20">
    <div className="max-w-2xl">
      <BadgeSoft variant="primary"><Users className="h-3 w-3" /> Shared travel funding</BadgeSoft>
      <h2 className="mt-4 text-3xl md:text-4xl font-bold">Travel together, fund together.</h2>
      <p className="mt-3 text-muted-foreground">
        Whether it's a honeymoon, a family escape or a company offsite — pool travel credits together with full clarity.
      </p>
    </div>

    <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {fundingTypes.map((f) => (
        <div key={f.title} className="rounded-2xl border bg-card p-5 shadow-card transition-base hover:shadow-elevated">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--accent-soft))] text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold">{f.raised} <span className="text-xs font-normal text-muted-foreground">of {f.goal}</span></p>
              <p className="text-xs font-semibold text-[hsl(var(--success))]">{f.progress}%</p>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--accent))]" style={{ width: `${f.progress}%` }} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className={cn("h-6 w-6 rounded-full ring-2 ring-card", i === 0 ? "bg-[hsl(var(--accent))]" : i === 1 ? "bg-primary" : "bg-[hsl(var(--success))]")} />
              ))}
              <span className="h-6 px-1.5 rounded-full ring-2 ring-card bg-muted text-[10px] font-medium grid place-items-center text-muted-foreground">+4</span>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">Contribute <ArrowRight className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ───── 4. Smart Funding Insights ───── */
const insights = [
  { icon: Sparkles, tone: "success", title: "Best use of your balance", desc: "Apply €410 hotel credits to your June Rome trip — saves 38%." },
  { icon: TrendingUp, tone: "primary", title: "Reduce this itinerary by 42%", desc: "Combining flight and hotel credits unlocks a package discount." },
  { icon: Hotel, tone: "warning", title: "Use hotel credits before peak", desc: "Rates rise after May 30 — book sooner to maximize value." },
  { icon: Package, tone: "success", title: "Best value for your credits", desc: "This Tokyo package gives the highest €/credit return available." },
];

const insightTone = (t: string) =>
  t === "success" ? "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]"
  : t === "warning" ? "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]"
  : "bg-[hsl(var(--primary-soft))] text-primary";

export const FundingInsightsSection = () => (
  <section className="bg-soft border-y">
    <div className="container py-20 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
      <div>
        <BadgeSoft variant="accent"><Sparkles className="h-3 w-3" /> Smart funding insights</BadgeSoft>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold">Quiet intelligence for your travel money.</h2>
        <p className="mt-3 text-muted-foreground max-w-md">
          Travixis explains how to use your credits — never pushes upsells. Always transparent. Always your call.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {insights.map((i) => (
          <div key={i.title} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-start gap-3">
              <div className={cn("grid h-9 w-9 place-items-center rounded-lg shrink-0", insightTone(i.tone))}>
                <i.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">{i.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{i.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ───── Travel Categories supported (compact strip) ───── */
const categories = [
  { icon: Plane, label: "Flights" }, { icon: Hotel, label: "Hotels" },
  { icon: Train, label: "Trains" }, { icon: Package, label: "Packages" },
  { icon: Compass, label: "Activities" }, { icon: CarFront, label: "Transfers" },
  { icon: Building2, label: "Lounges" }, { icon: Ship, label: "Cruises" },
  { icon: ShieldCheck, label: "Insurance" }, { icon: CarFront, label: "Car rentals" },
  { icon: Users, label: "Group travel" }, { icon: Briefcase, label: "Business" },
];

export const WalletCategoriesStrip = () => (
  <section className="container py-14">
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">One balance, every travel category</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {categories.map((c) => (
          <div key={c.label} className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-[hsl(var(--primary-soft))] text-primary">
              <c.icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
