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
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
              <GitCompare className="h-4 w-4" />
            </span>
            <SheetTitle className="text-base font-semibold tracking-tight">
              Side-by-side comparison
            </SheetTitle>
          </div>
        </SheetHeader>

        {options.length < 2 ? (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            Select at least 2 options to compare.
          </div>
        ) : (
          <div className="px-6 py-6 space-y-6">
            {winner && (
              <div className="rounded-2xl border border-primary/20 bg-[hsl(var(--primary-soft))]/50 p-5">
                <div className="flex items-center gap-2">
                  <BadgeSoft variant="primary"><Sparkles className="h-3 w-3" /> Travixis recommends</BadgeSoft>
                  <span className="text-[11px] text-muted-foreground">AI rationale · explainable</span>
                </div>
                <p className="mt-3 text-lg font-semibold tracking-tight">
                  {winner.airline} <span className="text-muted-foreground font-normal">— {winner.route}</span>
                </p>
                <ul className="mt-3 space-y-1.5">
                  {rationale.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-[13px] text-foreground/85">
                      <Lightbulb className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-primary/80">
                  <ShieldCheck className="h-3 w-3" /> AI helps. You decide.
                </p>
              </div>
            )}

            <ComparisonPanel options={options} onClear={onClear} onRemove={onRemove} />
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
