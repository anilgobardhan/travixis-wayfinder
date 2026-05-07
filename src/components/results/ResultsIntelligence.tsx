import { useMemo, useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Wallet,
  Clock,
  Luggage,
  Plane,
  Gauge,
  Filter,
  GitCompare,
  X,
  Cloud,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { BadgeSoft } from "@/components/BadgeSoft";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ───── Types (loose, frontend-only) ───── */
export type IntelOption = {
  id: string;
  airline: string;
  route: string;
  duration: string;
  stops: string;
  price: number;
  taxes: number;
  baggage: number;
  fees: number;
  currency: string;
  riskScore: number; // 0-100, lower = better
  baggageInfo: string;
  refund: string;
  why: string;
  tag?: string;
};

const fmt = (n: number, c = "EUR") => {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: c, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${c} ${Math.round(n)}`;
  }
};

/* ───── Confidence score ─────
   Pure derivation, no mutation. Blends risk + value. */
export const confidenceScore = (o: IntelOption): { score: number; label: string; tone: "success" | "warning" | "danger" } => {
  const total = o.price + o.taxes + o.baggage + o.fees;
  const valueScore = Math.max(0, 100 - Math.min(100, (total - 100) / 4));
  const riskComponent = 100 - o.riskScore;
  const baggageBoost = o.baggage === 0 ? 4 : 0;
  const score = Math.round(riskComponent * 0.55 + valueScore * 0.4 + baggageBoost);
  const tone: "success" | "warning" | "danger" = score >= 85 ? "success" : score >= 70 ? "warning" : "danger";
  const label = score >= 85 ? "Excellent balance" : score >= 70 ? "Good value" : "Higher disruption probability";
  return { score, label, tone };
};

/* ───── Smart Filters ───── */
export type SmartFilterKey =
  | "all"
  | "lowest-risk"
  | "best-value"
  | "carry-on"
  | "best-arrival"
  | "minimal-stress"
  | "reliable"
  | "family"
  | "business";

const filters: { key: SmartFilterKey; label: string; icon: any }[] = [
  { key: "all", label: "All options", icon: Filter },
  { key: "lowest-risk", label: "Lowest risk", icon: ShieldCheck },
  { key: "best-value", label: "Best value", icon: Sparkles },
  { key: "carry-on", label: "Carry-on included", icon: Luggage },
  { key: "best-arrival", label: "Best arrival", icon: Clock },
  { key: "minimal-stress", label: "Minimal stress", icon: Gauge },
  { key: "reliable", label: "Reliable airlines", icon: Plane },
  { key: "family", label: "Family friendly", icon: ShieldCheck },
  { key: "business", label: "Business optimized", icon: Wallet },
];

export const SmartFiltersBar = ({
  active,
  onChange,
}: { active: SmartFilterKey; onChange: (k: SmartFilterKey) => void }) => (
  <div className="rounded-2xl border bg-card p-4 shadow-card">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <Filter className="inline h-4 w-4 mr-1.5 text-primary" /> Intelligent filters
      </h3>
      <span className="text-xs text-muted-foreground">Refine by what matters to you</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => {
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-base",
              isActive
                ? "border-primary bg-[hsl(var(--primary-soft))] text-primary"
                : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/30"
            )}
          >
            <f.icon className="h-3.5 w-3.5" /> {f.label}
          </button>
        );
      })}
    </div>
  </div>
);

/* ───── Confidence chip ───── */
export const ConfidenceChip = ({ option }: { option: IntelOption }) => {
  const c = confidenceScore(option);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        c.tone === "success" && "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]",
        c.tone === "warning" && "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]",
        c.tone === "danger" && "bg-[hsl(var(--destructive-soft))] text-destructive"
      )}
      title="Travel confidence score"
    >
      <Gauge className="h-3 w-3" /> {c.score} · {c.label}
    </span>
  );
};

/* ───── Risk visualization chip (subtle) ───── */
export const RiskChips = ({ option }: { option: IntelOption }) => {
  const chips: { label: string; tone: "success" | "warning" | "primary"; icon: any }[] = [];
  if (option.riskScore < 20) chips.push({ label: "Low disruption risk", tone: "success", icon: ShieldCheck });
  else if (option.riskScore < 40) chips.push({ label: "Medium layover pressure", tone: "warning", icon: Gauge });
  else chips.push({ label: "Higher airport congestion", tone: "warning", icon: AlertTriangle });
  if (/direct/i.test(option.stops)) chips.push({ label: "No transfer", tone: "success", icon: Plane });
  if (option.baggage === 0) chips.push({ label: "Carry-on included", tone: "primary", icon: Luggage });
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <span
          key={c.label}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
            c.tone === "success" && "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]",
            c.tone === "warning" && "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]",
            c.tone === "primary" && "bg-[hsl(var(--primary-soft))] text-primary"
          )}
        >
          <c.icon className="h-2.5 w-2.5" /> {c.label}
        </span>
      ))}
    </div>
  );
};

/* ───── Side-by-side comparison panel ───── */
export const ComparisonPanel = ({
  options,
  onClear,
  onRemove,
}: {
  options: IntelOption[];
  onClear: () => void;
  onRemove: (id: string) => void;
}) => {
  if (options.length === 0) return null;
  const rows: { label: string; render: (o: IntelOption) => React.ReactNode; bestKey?: (o: IntelOption) => number; bestDir?: "min" | "max" }[] = [
    { label: "Price (true total)", render: (o) => fmt(o.price + o.taxes + o.baggage + o.fees, o.currency), bestKey: (o) => o.price + o.taxes + o.baggage + o.fees, bestDir: "min" },
    { label: "Duration", render: (o) => o.duration },
    { label: "Stops", render: (o) => o.stops },
    { label: "Delay risk", render: (o) => `${o.riskScore}/100`, bestKey: (o) => o.riskScore, bestDir: "min" },
    { label: "Cancellation probability", render: (o) => o.riskScore < 20 ? "Low" : o.riskScore < 40 ? "Moderate" : "Elevated" },
    { label: "Transfer stress", render: (o) => /direct/i.test(o.stops) ? "None" : o.riskScore < 30 ? "Light" : "Tight" },
    { label: "Baggage", render: (o) => o.baggageInfo },
    { label: "Airport quality", render: (o) => o.riskScore < 25 ? "High" : "Average" },
    { label: "Arrival quality", render: (o) => /direct/i.test(o.stops) ? "Smooth" : "Connected" },
    { label: "Sleep friendliness", render: (o) => /direct/i.test(o.stops) && o.riskScore < 30 ? "Good" : "Moderate" },
    { label: "Confidence score", render: (o) => `${confidenceScore(o).score} · ${confidenceScore(o).label}`, bestKey: (o) => confidenceScore(o).score, bestDir: "max" },
  ];

  const bestIndex = (row: typeof rows[number]) => {
    if (!row.bestKey) return -1;
    const vals = options.map(row.bestKey);
    if (row.bestDir === "max") return vals.indexOf(Math.max(...vals));
    return vals.indexOf(Math.min(...vals));
  };

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-elevated">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <BadgeSoft variant="primary"><GitCompare className="h-3 w-3" /> Side-by-side comparison</BadgeSoft>
          <h2 className="mt-2 text-xl font-semibold">Compare {options.length} option{options.length > 1 ? "s" : ""}</h2>
          <p className="text-sm text-muted-foreground">Best value highlighted per row.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClear}>Clear all</Button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 pr-4 font-medium text-muted-foreground text-xs uppercase tracking-wide">Criterion</th>
              {options.map((o) => (
                <th key={o.id} className="text-left py-3 px-4 min-w-[180px]">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{o.airline}</p>
                      <p className="text-xs text-muted-foreground font-normal">{o.route}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(o.id)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Remove from comparison"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const best = bestIndex(row);
              return (
                <tr key={row.label} className="border-b last:border-0">
                  <td className="py-3 pr-4 text-xs text-muted-foreground">{row.label}</td>
                  {options.map((o, i) => (
                    <td
                      key={o.id}
                      className={cn(
                        "py-3 px-4 text-sm",
                        i === best && "font-semibold text-[hsl(var(--success))]"
                      )}
                    >
                      {row.render(o)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

/* ───── Smart filter logic ───── */
export const applySmartFilter = (opts: IntelOption[], key: SmartFilterKey): IntelOption[] => {
  switch (key) {
    case "lowest-risk": return [...opts].sort((a, b) => a.riskScore - b.riskScore);
    case "best-value": return [...opts].sort((a, b) => confidenceScore(b).score - confidenceScore(a).score);
    case "carry-on": return opts.filter((o) => /carry/i.test(o.baggageInfo));
    case "best-arrival": return [...opts].sort((a, b) => a.duration.localeCompare(b.duration));
    case "minimal-stress": return [...opts].filter((o) => o.riskScore < 30);
    case "reliable": return [...opts].filter((o) => o.riskScore < 25);
    case "family": return [...opts].filter((o) => /direct/i.test(o.stops) || o.baggage > 0);
    case "business": return [...opts].sort((a, b) => a.duration.localeCompare(b.duration)).filter((o) => o.riskScore < 35);
    default: return opts;
  }
};

/* ───── "Why this option?" explanation chips ───── */
export const WhyChips = ({ option }: { option: IntelOption }) => {
  const reasons: string[] = [];
  const conf = confidenceScore(option);
  if (conf.score >= 85) reasons.push("Best overall value");
  if (option.riskScore < 20) reasons.push("Lowest disruption risk");
  if (option.riskScore < 25) reasons.push("Reliable airline");
  if (/direct/i.test(option.stops)) reasons.push("No transfer needed");
  else if (option.riskScore < 30) reasons.push("Short layover balance");
  if (/included/i.test(option.baggageInfo) || option.baggage === 0) reasons.push("Carry-on included");
  if (option.riskScore < 25) reasons.push("Better arrival timing");
  if (reasons.length === 0) reasons.push("Honest tradeoff for the price");
  return (
    <div className="flex flex-wrap gap-1.5">
      {reasons.slice(0, 4).map((r) => (
        <span key={r} className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--accent-soft))] text-primary px-2 py-0.5 text-[10px] font-medium">
          <Sparkles className="h-2.5 w-2.5" /> {r}
        </span>
      ))}
    </div>
  );
};
