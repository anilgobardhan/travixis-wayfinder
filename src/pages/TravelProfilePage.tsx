import { UserRound, Plane, Clock, Luggage, ShieldCheck, Sparkles, Globe2 } from "lucide-react";
import { BadgeSoft } from "@/components/BadgeSoft";
import { Button } from "@/components/ui/button";

const prefs = [
  { icon: Plane, label: "Cabin", value: "Economy · Window" },
  { icon: Clock, label: "Departure window", value: "After 08:00" },
  { icon: Luggage, label: "Baggage", value: "Always 1 checked bag" },
  { icon: ShieldCheck, label: "Risk tolerance", value: "Low — calmer routes preferred" },
  { icon: Globe2, label: "Home airport", value: "AMS · Amsterdam" },
];

const TravelProfilePage = () => (
  <div className="container max-w-5xl space-y-7">
    <header>
      <p className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-muted-foreground">Travel OS</p>
      <h1 className="mt-1.5 text-3xl font-semibold tracking-tight">Travel profile</h1>
      <p className="mt-1 text-[13px] text-muted-foreground">The signals Travixis uses to recommend calmer trips.</p>
    </header>

    <section className="result-card rounded-2xl border border-border/70 bg-card p-6 shadow-card flex items-center gap-4">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-[hsl(var(--primary-soft))] text-primary">
        <UserRound className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-semibold tracking-tight">Guest traveler</p>
        <p className="text-[12.5px] text-muted-foreground">Sign in to personalize recommendations across devices.</p>
      </div>
      <Button variant="soft" size="sm">Sign in</Button>
    </section>

    <section className="result-card rounded-2xl border border-border/70 bg-card p-6 shadow-card">
      <p className="flex items-center gap-2 text-[12px] font-semibold"><Sparkles className="h-3.5 w-3.5 text-primary" /> Your preferences</p>
      <ul className="mt-4 grid sm:grid-cols-2 gap-3">
        {prefs.map((p) => (
          <li key={p.label} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/60 p-3.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
              <p.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{p.label}</p>
              <p className="text-[13px] font-medium">{p.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>

    <section className="result-card rounded-2xl border border-border/70 bg-card p-6 shadow-card">
      <p className="flex items-center gap-2 text-[12px] font-semibold"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Calm-travel signals</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <BadgeSoft variant="primary">Avoid red-eyes</BadgeSoft>
        <BadgeSoft variant="primary">Prefer direct</BadgeSoft>
        <BadgeSoft variant="success">Wallet-aware</BadgeSoft>
        <BadgeSoft variant="primary">Mid-week return</BadgeSoft>
      </div>
    </section>
  </div>
);

export default TravelProfilePage;
