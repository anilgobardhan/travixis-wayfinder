import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * AI loading state — operational, never gimmicky.
 * Cycles through calm Travixis-tone phrases.
 */
const DEFAULTS = [
  "Analyzing calmer routes…",
  "Checking transfer reliability…",
  "Reviewing weather confidence…",
  "Optimizing wallet usage…",
];

export const AILoading = ({
  phrases = DEFAULTS,
  className,
}: {
  phrases?: string[];
  className?: string;
}) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % phrases.length), 1800);
    return () => clearInterval(t);
  }, [phrases.length]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-[hsl(var(--primary-soft))]/60 px-3.5 py-1.5 text-[12px] font-medium text-primary",
        className,
      )}
    >
      <span className="relative grid h-2 w-2 place-items-center">
        <span className="absolute inset-0 rounded-full bg-primary/40 ambient-pulse" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      <Sparkles className="h-3 w-3" />
      <span className="signal-fade" key={i}>{phrases[i]}</span>
    </div>
  );
};

/** Soft shimmer skeleton block. */
export const Shimmer = ({ className }: { className?: string }) => (
  <div className={cn("travixis-shimmer rounded-md bg-muted/70", className)} aria-hidden="true" />
);

/** Premium skeleton card matching results card rhythm. */
export const ResultCardSkeleton = () => (
  <div className="rounded-2xl border border-border/70 bg-card p-5 md:p-6 shadow-card">
    <div className="flex gap-2">
      <Shimmer className="h-5 w-24" />
      <Shimmer className="h-5 w-20" />
    </div>
    <div className="mt-4 flex items-start gap-4">
      <Shimmer className="h-11 w-11 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-40" />
        <Shimmer className="h-3 w-28" />
      </div>
      <Shimmer className="h-7 w-20" />
    </div>
    <div className="mt-5 grid grid-cols-3 gap-3">
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-full" />
    </div>
    <Shimmer className="mt-5 h-9 w-full rounded-lg" />
  </div>
);
