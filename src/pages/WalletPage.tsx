import { Link } from "react-router-dom";
import {
  Wallet,
  Send,
  Gift,
  Users,
  Sparkles,
  ArrowRight,
  Plane,
  Hotel,
  Train,
  Package,
  Compass,
  Heart,
  Briefcase,
  Cake,
  ShieldCheck,
  TrendingUp,
  PiggyBank,
  Globe2,
} from "lucide-react";
import { BadgeSoft } from "@/components/BadgeSoft";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const balances = [
  { icon: Plane, label: "Flights", value: "€620" },
  { icon: Hotel, label: "Hotels", value: "€410" },
  { icon: Train, label: "Rail", value: "€180" },
  { icon: Package, label: "Packages", value: "€70" },
  { icon: Compass, label: "Experiences", value: "€140" },
];

const actions = [
  { icon: Send, title: "Send travel credit", desc: "Transfer balance to a friend or family member instantly." },
  { icon: Gift, title: "Gift travel", desc: "Send credits for birthdays, honeymoons or shared trips." },
  { icon: Users, title: "Shared funding", desc: "Pool credits with family, friends or your team." },
  { icon: Compass, title: "Explore wallet", desc: "See coverage, eligible trips and credit history." },
];

const giftIdeas = [
  { icon: Heart, title: "Honeymoon fund", desc: "Loved ones contribute to a once-in-a-lifetime trip." },
  { icon: Users, title: "Family vacation", desc: "Plan together, fund together — transparently." },
  { icon: Cake, title: "Birthday travel gift", desc: "A meaningful, flexible gift across categories." },
  { icon: Briefcase, title: "Team travel pool", desc: "Company-wide credits for offsites and retreats." },
];

const pools = [
  { icon: Heart, title: "Honeymoon in Tuscany", progress: 72, raised: "€2,160", goal: "€3,000", contributors: 8, lead: "Started by Emma" },
  { icon: Users, title: "Family Summer 2026", progress: 45, raised: "€1,800", goal: "€4,000", contributors: 5, lead: "3 contributors this week" },
  { icon: Briefcase, title: "Lisbon team offsite", progress: 88, raised: "€7,040", goal: "€8,000", contributors: 14, lead: "Funded by 14 teammates" },
];

const recentActivity = [
  { kind: "gift", icon: Gift, title: "€120 gifted by Emma", desc: "For your honeymoon fund · 2h ago", tone: "accent" },
  { kind: "milestone", icon: Sparkles, title: "Tuscany fund reached 72%", desc: "Just €840 to your goal", tone: "primary" },
  { kind: "join", icon: Users, title: "Marco joined Family Summer 2026", desc: "Now 5 contributors · transparent split", tone: "primary" },
];

const insights = [
  { icon: Sparkles, title: "Best use of your balance", desc: "Apply €410 hotel credits to your June Rome trip — saves 38%." },
  { icon: TrendingUp, title: "Combine balances for value", desc: "Bundling flight + hotel credits unlocks package pricing." },
  { icon: Hotel, title: "Use hotel credits before peak", desc: "Rates rise after May 30 — book sooner to maximize value." },
  { icon: ShieldCheck, title: "Low-risk recommendation", desc: "Your wallet covers a fully refundable Lisbon weekend." },
];

const WalletPage = () => {
  return (
    <div>
      {/* Hero / Balance */}
      <section className="border-b bg-gradient-to-b from-[hsl(var(--primary-soft))]/40 to-transparent">
        <div className="container py-14 md:py-20">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
            <div>
              <BadgeSoft variant="primary"><Wallet className="h-3 w-3" /> Travel wallet</BadgeSoft>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">Your travel money, intelligently organized.</h1>
              <p className="mt-4 text-muted-foreground max-w-xl">
                One unified balance for every part of your trip — flights, hotels, rail, packages and experiences.
                Transparent, shareable, always explainable.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Button variant="hero" size="sm"><Send className="h-4 w-4" /> Send travel credit</Button>
                <Button variant="outline" size="sm" className="border-primary/30 text-primary"><Gift className="h-4 w-4" /> Gift travel</Button>
                <Button variant="ghost" size="sm" className="text-primary">Manage wallet <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="rounded-3xl bg-hero p-8 text-primary-foreground shadow-elevated relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_80%_20%,white_1px,transparent_1px)] [background-size:22px_22px]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wide text-white/70">Available travel balance</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" /> Active
                  </span>
                </div>
                <p className="mt-2 text-5xl font-bold tracking-tight tabular-nums">€1,420</p>
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
        </div>
      </section>

      {/* Smart wallet assistant — proactive intelligence */}
      <section className="container pt-14">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="max-w-2xl">
            <BadgeSoft variant="primary"><Sparkles className="h-3 w-3" /> Smart wallet assistant</BadgeSoft>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold">Proactive suggestions, never pushy.</h2>
            <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">
              Travixis watches your balance, your trips and your travel goals — and quietly surfaces what's worth your attention.
            </p>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
            4 active insights
          </span>
        </div>
        <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, tone: "primary", title: "Cheaper departure dates", desc: "Shifting Lisbon by 2 days saves ~€86 from your wallet.", cta: "View dates" },
            { icon: Users, tone: "accent", title: "Combine balances", desc: "Pool with 2 family members to fully fund a summer trip.", cta: "Start pool" },
            { icon: PiggyBank, tone: "primary", title: "Destination savings goal", desc: "On track for Tokyo by November — €420 to go.", cta: "Adjust goal" },
            { icon: ShieldCheck, tone: "warning", title: "Credits expire in 18 days", desc: "€140 in package credits — apply to a Q3 trip.", cta: "Use credits" },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border bg-card p-5 shadow-card hover:shadow-elevated transition-base">
              <div className="flex items-start justify-between">
                <div className={cn(
                  "grid h-9 w-9 place-items-center rounded-lg",
                  s.tone === "warning"
                    ? "bg-[hsl(var(--accent-soft))] text-[hsl(var(--warning))]"
                    : s.tone === "accent"
                    ? "bg-[hsl(var(--accent-soft))] text-primary"
                    : "bg-[hsl(var(--primary-soft))] text-primary"
                )}>
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Insight</span>
              </div>
              <p className="mt-4 text-sm font-semibold leading-snug">{s.title}</p>
              <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
              <button type="button" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                {s.cta} <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Wallet actions */}
      <section className="container py-16">
        <div className="max-w-2xl">
          <BadgeSoft variant="accent"><Sparkles className="h-3 w-3" /> Wallet actions</BadgeSoft>
          <h2 className="mt-3 text-3xl font-bold">Move, gift and share travel money.</h2>
          <p className="mt-2 text-[15px] text-muted-foreground">Premium financial clarity — built for the way modern travelers actually plan.</p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...actions, { icon: Users, title: "Split trip with friends", desc: "Divide a trip's true total cost evenly — Travixis tracks balances." }].map((a) => (
            <button
              key={a.title}
              type="button"
              className="text-left rounded-2xl border bg-card p-5 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-base"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
                <a.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 font-semibold">{a.title}</p>
              <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{a.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Gift Travel */}
      <section className="bg-soft border-y">
        <div className="container py-16 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <div>
            <BadgeSoft variant="primary"><Gift className="h-3 w-3" /> Gift travel</BadgeSoft>
            <h2 className="mt-3 text-3xl font-bold">Give the most meaningful gift: travel.</h2>
            <p className="mt-3 text-muted-foreground max-w-md">
              Send travel credits to the people you care about. Flexible across every category, redeemable whenever they're ready.
            </p>
            <div className="mt-5 flex gap-2.5">
              <Button variant="hero" size="sm"><Gift className="h-4 w-4" /> Send a travel gift</Button>
              <Button variant="soft" size="sm">How gifting works</Button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {giftIdeas.map((g) => (
              <div key={g.title} className="rounded-2xl border bg-card p-5 shadow-card">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[hsl(var(--accent-soft))] text-primary">
                  <g.icon className="h-4 w-4" />
                </div>
                <p className="mt-3 font-semibold text-sm">{g.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shared Funding */}
      <section className="container py-16">
        <div className="max-w-2xl">
          <BadgeSoft variant="accent"><Users className="h-3 w-3" /> Shared funding</BadgeSoft>
          <h2 className="mt-3 text-3xl font-bold">Travel together, financially.</h2>
          <p className="mt-2 text-muted-foreground">Family pools, group contributions, company trips and split travel budgets — all transparent.</p>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {pools.map((p) => (
            <div key={p.title} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[14.5px] tracking-tight">{p.title}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground leading-relaxed">{p.lead}</p>
                </div>
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <p className="text-[13.5px] font-semibold tabular-nums">{p.raised} <span className="text-[11.5px] font-normal text-muted-foreground">of {p.goal}</span></p>
                <p className="text-[11.5px] font-semibold text-[hsl(var(--success))] tabular-nums">{p.progress}%</p>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--accent))]" style={{ width: `${p.progress}%` }} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className={cn("h-6 w-6 rounded-full ring-2 ring-card", i === 0 ? "bg-[hsl(var(--accent))]" : i === 1 ? "bg-primary" : "bg-[hsl(var(--success))]")} />
                    ))}
                    {p.contributors > 3 && (
                      <span className="h-6 px-1.5 rounded-full ring-2 ring-card bg-muted text-[10px] font-medium grid place-items-center text-muted-foreground">
                        +{p.contributors - 3}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{p.contributors} contributors</span>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">Contribute <ArrowRight className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>

        {/* Social activity strip — calm, human */}
        <div className="mt-8 rounded-2xl border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-muted-foreground">Recent shared activity</p>
            <span className="text-[11px] text-muted-foreground">Visible only to your circle</span>
          </div>
          <ul className="mt-4 divide-y divide-border/60">
            {recentActivity.map((a) => (
              <li key={a.title} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className={cn(
                  "grid h-8 w-8 place-items-center rounded-lg shrink-0",
                  a.tone === "accent" ? "bg-[hsl(var(--accent-soft))] text-primary" : "bg-[hsl(var(--primary-soft))] text-primary"
                )}>
                  <a.icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium leading-snug">{a.title}</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">{a.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Smart Wallet Intelligence */}
      <section className="bg-soft border-y">
        <div className="container py-16 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <div>
            <BadgeSoft variant="accent"><Sparkles className="h-3 w-3" /> Smart wallet intelligence</BadgeSoft>
            <h2 className="mt-3 text-3xl font-bold">Quiet intelligence for your travel money.</h2>
            <p className="mt-3 text-muted-foreground max-w-md">
              Travixis explains how to use your credits — never pushes upsells. Always transparent. Always your call.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {insights.map((i) => (
              <div key={i.title} className="rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary shrink-0">
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

      {/* Closing CTA */}
      <section className="container py-16">
        <div className="rounded-3xl border bg-card p-8 md:p-10 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <BadgeSoft variant="primary"><PiggyBank className="h-3 w-3" /> One balance, every category</BadgeSoft>
            <h3 className="mt-3 text-2xl font-semibold">Put your travel wallet to work.</h3>
            <p className="mt-1 text-sm text-muted-foreground">Apply credits, send gifts, or pool funds — all from one calm interface.</p>
          </div>
          <div className="flex gap-2.5">
            <Button asChild variant="hero" size="sm"><Link to="/search">Find a trip <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button variant="outline" size="sm" className="border-primary/30 text-primary"><Globe2 className="h-4 w-4" /> Explore coverage</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WalletPage;
