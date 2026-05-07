import { Link } from "react-router-dom";
import { Plane, MapPin, CalendarRange, Sparkles, ShieldCheck, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeSoft } from "@/components/BadgeSoft";

const trips = [
  {
    id: "lis-2026",
    title: "Lisbon retreat",
    route: "AMS → LIS",
    dates: "14–21 Jul 2026",
    status: "Confirmed",
    statusTone: "success" as const,
    insight: "Calmer arrival window detected — no action needed.",
  },
  {
    id: "rome-2026",
    title: "Rome with family",
    route: "AMS → FCO",
    dates: "12–19 Sep 2026",
    status: "In planning",
    statusTone: "primary" as const,
    insight: "Wallet would cover 64% — good time to lock the dates.",
  },
  {
    id: "tokyo-2027",
    title: "Tokyo · honeymoon",
    route: "AMS → HND",
    dates: "Apr 2027",
    status: "Saved",
    statusTone: "warning" as const,
    insight: "Prices historically dip 10–14 weeks out.",
  },
];

const MyTripsPage = () => (
  <div className="container max-w-6xl space-y-7">
    <header className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <p className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-muted-foreground">Travel OS</p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight">My trips</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Confirmed, planned, and saved — all in one calm view.</p>
      </div>
      <Button asChild variant="hero" size="sm"><Link to="/search">Plan a new trip <ArrowRight className="h-4 w-4" /></Link></Button>
    </header>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trips.map((t) => (
        <article key={t.id} className="result-card rounded-2xl border border-border/70 bg-card p-5 shadow-card flex flex-col">
          <div className="flex items-center justify-between">
            <BadgeSoft variant={t.statusTone}>
              {t.status === "Confirmed" ? <CheckCircle2 className="h-3 w-3" /> : t.status === "In planning" ? <Clock className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
              {t.status}
            </BadgeSoft>
            <Plane className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <h2 className="mt-3 text-[17px] font-semibold tracking-tight">{t.title}</h2>
          <p className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground"><MapPin className="h-3 w-3" /> {t.route}</p>
          <p className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground"><CalendarRange className="h-3 w-3" /> {t.dates}</p>
          <p className="mt-4 rounded-lg bg-[hsl(var(--primary-soft))]/60 px-3 py-2 text-[12px] text-primary leading-relaxed">
            <Sparkles className="inline h-3 w-3 mr-1" /> {t.insight}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button asChild variant="soft" size="sm"><Link to="/trip">Open trip</Link></Button>
            <Button asChild variant="ghost" size="sm"><Link to="/booking-review">Review</Link></Button>
          </div>
        </article>
      ))}
    </div>

    <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-card">
      <p className="flex items-center gap-2 text-[12px] font-semibold"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> AI watching for you</p>
      <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
        Travixis monitors prices, weather, and disruption signals across your saved trips and only alerts when something is worth your attention.
      </p>
    </section>
  </div>
);

export default MyTripsPage;
