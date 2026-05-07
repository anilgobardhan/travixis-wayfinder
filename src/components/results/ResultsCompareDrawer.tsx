import { Sparkles, GitCompare, ShieldCheck, Wallet, Filter as FilterIcon, ArrowUpDown, Lightbulb } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BadgeSoft } from "@/components/BadgeSoft";
import { ComparisonPanel, confidenceScore, type IntelOption } from "./ResultsIntelligence";
import { cn } from "@/lib/utils";

const fmt = (n: number, c = "EUR") => {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${c} ${Math.round(n)}`;
  }
};

const buildRationale = (winner: IntelOption, others: IntelOption[]) => {
  const reasons: string[] = [];
  const winnerTotal = winner.price + winner.taxes + winner.baggage + winner.fees;
  const cheapest = [...others, winner].sort((a, b) =>
    (a.price + a.taxes + a.baggage + a.fees) - (b.price + b.taxes + b.baggage + b.fees))[0];
  const safest = [...others, winner].sort((a, b) => a.riskScore - b.riskScore)[0];

  if (winner.id === safest.id) reasons.push("Lowest disruption probability among compared options.");
  if (winner.id === cheapest.id) reasons.push("Cheapest true total — no hidden checkout surcharges.");
  else {
    const diff = winnerTotal - (cheapest.price + cheapest.taxes + cheapest.baggage + cheapest.fees);
    if (diff > 0) reasons.push(`Costs ${fmt(diff, winner.currency)} more than the cheapest, but trades up on reliability and stress.`);
  }
  if (/direct/i.test(winner.stops)) reasons.push("Direct routing — no transfer fatigue or missed-connection risk.");
  if (winner.baggage === 0 || /included/i.test(winner.baggageInfo)) reasons.push("Carry-on or checked baggage included in the fare.");
  if (/refundable|flexible|free changes/i.test(winner.refund)) reasons.push("Flexible refund — protects against last-minute changes.");
  return reasons.slice(0, 4);
};

export const CompareDrawer = ({
  open,
  onOpenChange,
  options,
  onClear,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  options: IntelOption[];
  onClear: () => void;
  onRemove: (id: string) => void;
}) => {
  const ranked = [...options].sort((a, b) => confidenceScore(b).score - confidenceScore(a).score);
  const winner = ranked[0];
  const rationale = winner ? buildRationale(winner, ranked.slice(1)) : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto p-0">
        <SheetHeader className="px-7 pt-7 pb-5 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
              <GitCompare className="h-4 w-4" />
            </span>
            <div>
              <SheetTitle className="text-[15px] font-semibold tracking-tight leading-none">
                Side-by-side comparison
              </SheetTitle>
              <p className="mt-1.5 text-[11.5px] text-muted-foreground leading-relaxed">
                Travixis advises — you decide. Differences highlighted, never hidden.
              </p>
            </div>
          </div>
        </SheetHeader>

        {options.length < 2 ? (
          <div className="px-7 py-14 text-center text-[13px] text-muted-foreground leading-relaxed">
            Select at least 2 options to compare.
          </div>
        ) : (
          <div className="px-7 py-7 space-y-7">
            {winner && (
              <div className="rounded-2xl border border-primary/25 bg-gradient-to-b from-[hsl(var(--primary-soft))]/70 to-[hsl(var(--primary-soft))]/20 p-6 shadow-card relative">
                <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-[10px] font-semibold tracking-wide shadow-sm">
                  <Sparkles className="h-2.5 w-2.5" /> AI recommends this one
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <BadgeSoft variant="primary"><ShieldCheck className="h-3 w-3" /> Highest confidence</BadgeSoft>
                  <span className="text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground font-medium">Explainable rationale</span>
                </div>
                <p className="mt-4 text-[20px] font-semibold tracking-tight leading-tight">
                  {winner.airline} <span className="text-muted-foreground font-normal">— {winner.route}</span>
                </p>
                <ul className="mt-4 space-y-2.5">
                  {rationale.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-[13.5px] text-foreground/85 leading-[1.55]">
                      <Lightbulb className="h-3.5 w-3.5 mt-1 text-primary shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-primary/75 tracking-wide">
                  <ShieldCheck className="h-3 w-3" /> AI helps. You decide.
                </p>
              </div>
            )}

            <div className="opacity-95">
              <p className="mb-3 text-[10.5px] uppercase tracking-[0.14em] font-semibold text-muted-foreground">Full breakdown</p>
              <ComparisonPanel options={options} onClear={onClear} onRemove={onRemove} />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export const MobileResultsBar = ({
  compareCount,
  onCompare,
  onFilters,
  onSort,
  onWallet,
  onExplain,
}: {
  compareCount: number;
  onCompare: () => void;
  onFilters: () => void;
  onSort: () => void;
  onWallet: () => void;
  onExplain: () => void;
}) => {
  const items = [
    { label: "Filters", icon: FilterIcon, onClick: onFilters },
    { label: "Sort", icon: ArrowUpDown, onClick: onSort },
    { label: compareCount > 0 ? `Compare · ${compareCount}` : "Compare", icon: GitCompare, onClick: onCompare, accent: compareCount >= 2 },
    { label: "Wallet", icon: Wallet, onClick: onWallet },
    { label: "AI", icon: Sparkles, onClick: onExplain },
  ];
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-7xl px-2 py-2 grid grid-cols-5 gap-1">
        {items.map((i) => (
          <button
            key={i.label}
            type="button"
            onClick={i.onClick}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10.5px] font-medium transition-base",
              i.accent
                ? "text-primary bg-[hsl(var(--primary-soft))]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <i.icon className="h-[17px] w-[17px]" />
            <span className="leading-none">{i.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
