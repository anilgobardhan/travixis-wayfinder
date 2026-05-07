import { Wallet, Sparkles, Package, Hotel, Plane, ShieldCheck, TrendingUp, Users, CreditCard, ArrowRight, PiggyBank, Layers } from "lucide-react";
import { BadgeSoft } from "@/components/BadgeSoft";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* Compact wallet-aware chip for individual results */
export const WalletAwareChip = ({
  totalPrice,
  balance = 1420,
}: { totalPrice: number; balance?: number }) => {
  const remaining = balance - totalPrice;
  const fullyCovered = remaining >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        fullyCovered
          ? "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]"
          : "bg-[hsl(var(--accent-soft))] text-primary"
      )}
      title="Travel wallet eligibility"
    >
      <Wallet className="h-3 w-3" />
      {fullyCovered
        ? `Covered · €${remaining} remaining after`
        : `Covers €${balance} of total`}
    </span>
  );
};

/* Results-page wallet summary block */
export const WalletInsightsPanel = ({ balance = 1420 }: { balance?: number }) => (
  <section className="rounded-2xl border bg-card p-6 shadow-card">
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div>
        <BadgeSoft variant="primary"><Wallet className="h-3 w-3" /> Wallet intelligence</BadgeSoft>
        <h2 className="mt-2 text-xl font-semibold">Best value for your balance</h2>
        <p className="text-sm text-muted-foreground">
          Combining price, risk, wallet usage and trip quality — not just cheapest.
        </p>
      </div>
      <div className="rounded-xl border bg-[hsl(var(--primary-soft))] px-4 py-3">
        <p className="text-[10px] uppercase tracking-wide text-primary/80 font-semibold">Available balance</p>
        <p className="mt-0.5 text-2xl font-bold text-primary">€{balance.toLocaleString()}</p>
      </div>
    </div>

    <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {[
        { icon: Sparkles, title: "Best use of credits", desc: "Apply hotel credits to your top-ranked option — saves €148." },
        { icon: Package, title: "Bundle intelligence", desc: "Flight + hotel package gives better total value using credits." },
        { icon: Hotel, title: "Hotel credits applicable", desc: "Up to €410 of hotel credits applies to 4 listings here." },
        { icon: Plane, title: "Eligible itineraries", desc: "All direct flights are wallet-eligible for instant booking." },
        { icon: ShieldCheck, title: "Transparent usage", desc: "Every credit used is itemized — no hidden conversion fees." },
        { icon: TrendingUp, title: "Reduce itinerary by 42%", desc: "Combine wallet + package optimization on the recommended pick." },
      ].map((i) => (
        <div key={i.title} className="rounded-xl border bg-background p-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[hsl(var(--primary-soft))]"><i.icon className="h-3.5 w-3.5" /></span>
            <p className="text-sm font-semibold text-foreground">{i.title}</p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{i.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

/* Trip dashboard wallet overview */
export const WalletOverviewModule = () => {
  const segments = [
    { label: "Available", value: 1420, tone: "primary" },
    { label: "Reserved", value: 320, tone: "accent" },
    { label: "Upcoming payments", value: 540, tone: "warning" },
    { label: "Package coverage", value: 280, tone: "success" },
  ];

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <BadgeSoft variant="primary"><Wallet className="h-3 w-3" /> Travel wallet</BadgeSoft>
          <h2 className="mt-2 text-xl font-semibold">Your trip's financial health</h2>
          <p className="text-sm text-muted-foreground">A calm view of credits, reservations and upcoming travel payments.</p>
        </div>
        <Button variant="soft" size="sm">Manage wallet <ArrowRight className="h-3.5 w-3.5" /></Button>
      </div>

      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {segments.map((s) => (
          <div key={s.label} className="rounded-xl border bg-background p-4">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{s.label}</p>
            <p className={cn(
              "mt-1 text-2xl font-bold",
              s.tone === "primary" && "text-primary",
              s.tone === "accent" && "text-primary",
              s.tone === "warning" && "text-[hsl(var(--warning))]",
              s.tone === "success" && "text-[hsl(var(--success))]"
            )}>€{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-[hsl(var(--accent-soft))] px-4 py-3 text-xs text-primary flex items-start gap-2">
        <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span><strong>Why this fits your balance:</strong> hotel credits cover 3 of 4 nights, and the package option lowers your out-of-pocket by 42%.</span>
      </div>
    </section>
  );
};

/* Shared trip funding module on dashboard */
export const SharedTripFundingModule = () => {
  const contributors = [
    { name: "You", amount: 800, color: "bg-primary" },
    { name: "Anna", amount: 420, color: "bg-[hsl(var(--accent))]" },
    { name: "Marc", amount: 360, color: "bg-[hsl(var(--success))]" },
    { name: "Lia", amount: 180, color: "bg-[hsl(var(--warning))]" },
  ];
  const goal = 2700;
  const raised = contributors.reduce((s, c) => s + c.amount, 0);
  const pct = Math.round((raised / goal) * 100);

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
        <div>
          <BadgeSoft variant="accent"><Users className="h-3 w-3" /> Shared trip funding</BadgeSoft>
          <h2 className="mt-2 text-xl font-semibold">Trip funded: {pct}%</h2>
          <p className="text-sm text-muted-foreground">Transparent contributions toward your group trip.</p>
        </div>
        <Button variant="hero" size="sm">Invite contributors</Button>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <p className="text-sm font-semibold">€{raised.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">of €{goal.toLocaleString()}</span></p>
        <p className="text-xs text-muted-foreground">4 contributors</p>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--accent))]" style={{ width: `${pct}%` }} />
      </div>

      <ul className="mt-5 space-y-2.5">
        {contributors.map((c) => (
          <li key={c.name} className="flex items-center gap-3 text-sm">
            <span className={cn("h-7 w-7 rounded-full grid place-items-center text-[10px] font-bold text-white", c.color)}>
              {c.name.charAt(0)}
            </span>
            <span className="flex-1 font-medium">{c.name}</span>
            <span className="text-muted-foreground">€{c.amount.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

/* Budget intelligence + payment preview combined */
export const BudgetAndPaymentModule = () => (
  <section className="rounded-2xl border bg-card p-6 shadow-card">
    <BadgeSoft variant="primary"><PiggyBank className="h-3 w-3" /> Budget intelligence</BadgeSoft>
    <h2 className="mt-2 text-xl font-semibold">Smart budget for this trip</h2>
    <p className="text-sm text-muted-foreground">Recommended allocation, savings and upgrade opportunities — all explainable.</p>

    <div className="mt-5 grid sm:grid-cols-2 gap-3">
      {[
        { icon: Layers, title: "Recommended allocation", desc: "Flights 45% · Hotels 35% · Experiences 15% · Buffer 5%." },
        { icon: TrendingUp, title: "Savings opportunity", desc: "Switch to Thursday departure — saves ~€84 with same comfort." },
        { icon: Sparkles, title: "Upgrade opportunity", desc: "Premium economy fits within wallet for €110 extra." },
        { icon: Package, title: "Package optimization", desc: "Bundle flight + hotel: better total value, fewer fees." },
      ].map((i) => (
        <div key={i.title} className="rounded-xl border bg-background p-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[hsl(var(--primary-soft))]"><i.icon className="h-3.5 w-3.5" /></span>
            <p className="text-sm font-semibold text-foreground">{i.title}</p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{i.desc}</p>
        </div>
      ))}
    </div>

    <div className="mt-6">
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">Payment experience</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {[
          { icon: Wallet, label: "Add credits" },
          { icon: Users, label: "Split payment" },
          { icon: CreditCard, label: "Installments" },
          { icon: TrendingUp, label: "Convert credits" },
          { icon: Sparkles, label: "Apply balance" },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            className="rounded-xl border bg-background px-3 py-3 text-xs font-medium text-foreground hover:border-primary/40 hover:shadow-card transition-base flex items-center gap-2 justify-center"
          >
            <p.icon className="h-3.5 w-3.5 text-primary" />
            {p.label}
          </button>
        ))}
      </div>
    </div>
  </section>
);
