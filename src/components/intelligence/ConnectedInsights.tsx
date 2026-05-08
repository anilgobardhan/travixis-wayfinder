// ============================================================================
// ConnectedInsights — surfaces cross-module IntelligenceEvent[] in a calm,
// scannable list. Used by Trip, Dashboard, Wallet pages so signals stay
// consistent across the product.
// ============================================================================

import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Wallet,
  Cloud,
  Plane,
  ShieldCheck,
  CalendarClock,
  UserRound,
} from "lucide-react";
import { BadgeSoft } from "@/components/BadgeSoft";
import { cn } from "@/lib/utils";
import type { IntelligenceEvent } from "@/lib/travel-os";

const sourceIcon = (s: IntelligenceEvent["source"]) => {
  switch (s) {
    case "wallet": return Wallet;
    case "weather": return Cloud;
    case "airport": return Plane;
    case "profile": return UserRound;
    case "schedule": return CalendarClock;
    case "carrier": return Plane;
    default: return Sparkles;
  }
};

const sevTone = (sev: IntelligenceEvent["severity"]) =>
  sev === "alert" ? "bg-destructive/10 text-destructive"
  : sev === "watch" ? "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]"
  : sev === "positive" ? "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]"
  : "bg-[hsl(var(--primary-soft))] text-primary";

const sevBadge = (sev: IntelligenceEvent["severity"]) =>
  sev === "alert" ? "warning"
  : sev === "watch" ? "warning"
  : sev === "positive" ? "success"
  : "primary";

export const ConnectedInsights = ({
  events,
  title = "Connected intelligence",
  subtitle = "Signals from your wallet, profile, and current trip — talking to each other.",
  compact = false,
}: {
  events: IntelligenceEvent[];
  title?: string;
  subtitle?: string;
  compact?: boolean;
}) => {
  if (!events.length) return null;
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-card">
      <header className="mb-4">
        <BadgeSoft variant="primary"><Sparkles className="h-3 w-3" /> Travel OS intelligence</BadgeSoft>
        <h2 className="mt-2 text-xl font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </header>
      <ul className={cn("grid gap-3", !compact && "md:grid-cols-2")}>
        {events.map((e) => {
          const Icon = sourceIcon(e.source);
          return (
            <li
              key={e.id}
              className="rounded-xl border bg-background p-4 flex items-start gap-3 transition-base hover:shadow-card"
            >
              <div className={cn("grid h-9 w-9 place-items-center rounded-lg shrink-0", sevTone(e.severity))}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium">{e.title}</p>
                  <BadgeSoft variant={sevBadge(e.severity) as any} className="capitalize">
                    {e.source}
                  </BadgeSoft>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{e.body}</p>
                {e.action && (
                  <Link
                    to={e.action.href}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    {e.action.label} <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
        <ShieldCheck className="h-3 w-3 text-primary" />
        Insights generated locally from your trip, wallet, and profile context.
      </p>
    </section>
  );
};

export default ConnectedInsights;
