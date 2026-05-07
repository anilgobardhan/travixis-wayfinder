import { Link } from "react-router-dom";
import { Bookmark, ArrowRight, TrendingDown, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeSoft } from "@/components/BadgeSoft";

const items = [
  { route: "AMS → BCN", dates: "Aug 8–15", price: "€186", trend: "down", note: "Down €34 this week — historically a good window." },
  { route: "AMS → LIS", dates: "Sep 4–11", price: "€212", trend: "down", note: "Calmer return day detected mid-week." },
  { route: "AMS → ATH", dates: "Oct 12–19", price: "€264", trend: "up", note: "Prices firming — locking now is reasonable." },
  { route: "AMS → MAD", dates: "Nov flexible", price: "€158", trend: "down", note: "Quieter arrival window appearing." },
];

const SavedSearchesPage = () => (
  <div className="container max-w-5xl space-y-7">
    <header className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <p className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-muted-foreground">Travel OS</p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight">Saved searches</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Travixis quietly tracks them and surfaces only meaningful changes.</p>
      </div>
      <Button asChild variant="hero" size="sm"><Link to="/search">New search <ArrowRight className="h-4 w-4" /></Link></Button>
    </header>

    <div className="space-y-3">
      {items.map((s) => {
        const TrendIcon = s.trend === "down" ? TrendingDown : TrendingUp;
        const tone = s.trend === "down" ? "success" : "warning";
        return (
          <article key={s.route + s.dates} className="result-card rounded-2xl border border-border/70 bg-card p-5 shadow-card flex flex-wrap items-center gap-4">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
              <Bookmark className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-semibold tracking-tight">{s.route}</p>
              <p className="text-[12px] text-muted-foreground">{s.dates}</p>
            </div>
            <BadgeSoft variant={tone as "success" | "warning"}><TrendIcon className="h-3 w-3" /> {s.price}</BadgeSoft>
            <p className="basis-full md:basis-auto md:flex-1 text-[12px] text-muted-foreground inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" /> {s.note}
            </p>
            <Button asChild variant="soft" size="sm"><Link to="/results">Open</Link></Button>
          </article>
        );
      })}
    </div>
  </div>
);

export default SavedSearchesPage;
