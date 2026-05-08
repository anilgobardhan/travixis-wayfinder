import { Link } from "react-router-dom";
import { Bookmark, ArrowRight, TrendingDown, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeSoft } from "@/components/BadgeSoft";
import { EmptyState } from "@/components/ui/empty-state";

const items = [
  { route: "AMS → BCN", dates: "Aug 8–15", price: "€186", trend: "down", note: "Vueling released seats — historically a good window." },
  { route: "AMS → LIS", dates: "Sep 4–11", price: "€212", trend: "down", note: "TAP added capacity · calmer return day mid-week." },
  { route: "LHR → JFK", dates: "Oct 12–19", price: "€512", trend: "up", note: "BA fares firming — locking in the next 7 days is reasonable." },
  { route: "FRA → BCN", dates: "Nov flexible", price: "€158", trend: "down", note: "Lufthansa added capacity — quieter arrival window." },
  { route: "DXB → SIN", dates: "Mar 2027", price: "€820", trend: "down", note: "Emirates released new Q1 inventory — better than 30-day average." },
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

    {items.length === 0 ? (
      <EmptyState
        icon={<Bookmark className="h-5 w-5" />}
        title="No watched routes yet"
        description="Save a search and Travixis will quietly monitor prices, weather confidence and disruption signals — surfacing only changes worth your attention."
        examples={["AMS → LIS · flexible dates", "LHR → JFK · summer", "DXB → SIN · Q1 2027"]}
        action={<Button asChild variant="hero" size="sm"><Link to="/search">Start a search <ArrowRight className="h-4 w-4" /></Link></Button>}
      />
    ) : (
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
    )}
  </div>
);

export default SavedSearchesPage;
