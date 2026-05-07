import { useMemo, useState } from "react";
import {
  ChevronDown,
  Filter as FilterIcon,
  Plane,
  Hotel,
  Package as PackageIcon,
  Car,
  TrainFront,
  Sparkles,
  X,
  ShieldCheck,
  Wallet,
  CloudSun,
  Gauge,
  Leaf,
  MapPin,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BadgeSoft } from "@/components/BadgeSoft";
import { cn } from "@/lib/utils";

export type SearchType = "flights" | "hotels" | "packages" | "cars" | "rail";

export type FlightFilters = {
  maxPrice: number;
  stops: string[]; // "Direct" | "1 stop" | "2+ stops"
  airlines: string[];
  baggageIncluded: boolean;
  refundableOnly: boolean;
  lowStressOnly: boolean;
};

export const defaultFlightFilters = (priceCap: number): FlightFilters => ({
  maxPrice: priceCap,
  stops: [],
  airlines: [],
  baggageIncluded: false,
  refundableOnly: false,
  lowStressOnly: false,
});

type Props = {
  searchType: SearchType;
  airlines: string[];
  priceMin: number;
  priceMax: number;
  filters: FlightFilters;
  onChange: (next: FlightFilters) => void;
  onClear: () => void;
  resultCount: number;
};

const Group = ({
  title,
  defaultOpen = true,
  children,
  hint,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  hint?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b border-border/60 py-4 last:border-b-0">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 text-left">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="pt-3 space-y-2.5">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const CheckRow = ({
  label,
  checked,
  onChange,
  intel,
  meta,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  intel?: string;
  meta?: string;
}) => (
  <label className="flex items-start gap-2.5 cursor-pointer rounded-md px-1.5 py-1 hover:bg-muted/50 transition-base">
    <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} className="mt-0.5" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-foreground">{label}</span>
        {meta && <span className="text-[11px] text-muted-foreground tabular-nums">{meta}</span>}
      </div>
      {intel && (
        <span className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] text-primary/80">
          <Sparkles className="h-2.5 w-2.5" /> {intel}
        </span>
      )}
    </div>
  </label>
);

const FlightFilterPanel = ({
  airlines,
  priceMin,
  priceMax,
  filters,
  onChange,
}: Pick<Props, "airlines" | "priceMin" | "priceMax" | "filters" | "onChange">) => {
  const stops = ["Direct", "1 stop", "2+ stops"];
  const toggle = <K extends keyof FlightFilters>(key: K, value: string) => {
    const arr = filters[key] as unknown as string[];
    const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
    onChange({ ...filters, [key]: next } as FlightFilters);
  };

  return (
    <>
      <Group title="Budget" hint="True total per traveler">
        <div className="px-1">
          <Slider
            min={priceMin}
            max={priceMax}
            step={10}
            value={[filters.maxPrice]}
            onValueChange={(v) => onChange({ ...filters, maxPrice: v[0] })}
          />
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
            <span>€{priceMin}</span>
            <span className="font-medium text-foreground">Up to €{filters.maxPrice}</span>
            <span>€{priceMax}</span>
          </div>
        </div>
      </Group>

      <Group title="Stops">
        {stops.map((s) => (
          <CheckRow
            key={s}
            label={s}
            checked={filters.stops.includes(s)}
            onChange={() => toggle("stops", s)}
            intel={s === "Direct" ? "Lower disruption risk" : undefined}
          />
        ))}
      </Group>

      <Group title="Airlines">
        {airlines.length === 0 && (
          <p className="text-xs text-muted-foreground">No airlines in current results.</p>
        )}
        {airlines.map((a) => (
          <CheckRow
            key={a}
            label={a}
            checked={filters.airlines.includes(a)}
            onChange={() => toggle("airlines", a)}
          />
        ))}
      </Group>

      <Group title="Baggage & flexibility">
        <CheckRow
          label="Baggage included"
          checked={filters.baggageIncluded}
          onChange={(v) => onChange({ ...filters, baggageIncluded: v })}
          intel="No surprise checkout fees"
        />
        <CheckRow
          label="Refundable / flexible"
          checked={filters.refundableOnly}
          onChange={(v) => onChange({ ...filters, refundableOnly: v })}
        />
      </Group>

      <Group title="Travixis intelligence" hint="Calm, calculated, optional">
        <CheckRow
          label="Low stress only"
          checked={filters.lowStressOnly}
          onChange={(v) => onChange({ ...filters, lowStressOnly: v })}
          intel="Lowest transfer stress · most reliable"
        />
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { icon: ShieldCheck, label: "Reliable carrier" },
            { icon: CloudSun, label: "Weather confidence" },
            { icon: Gauge, label: "Best value this month" },
            { icon: Wallet, label: "Wallet-eligible" },
          ].map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/30 px-2 py-0.5 text-[10.5px] text-muted-foreground"
            >
              <c.icon className="h-2.5 w-2.5" /> {c.label}
            </span>
          ))}
        </div>
      </Group>

      <Group title="Departure window" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-1.5">
          {["Early morning", "Morning", "Afternoon", "Evening"].map((t) => (
            <span
              key={t}
              className="rounded-md border border-border/60 px-2 py-1.5 text-[11px] text-muted-foreground text-center hover:bg-muted/40 cursor-pointer transition-base"
            >
              {t}
            </span>
          ))}
        </div>
      </Group>

      <Group title="Cabin class" defaultOpen={false}>
        {["Economy", "Premium Economy", "Business", "First"].map((c) => (
          <CheckRow key={c} label={c} checked={false} onChange={() => {}} />
        ))}
      </Group>
    </>
  );
};

const HotelFilterPanel = () => (
  <>
    <Group title="Star rating">
      {[5, 4, 3].map((s) => (
        <CheckRow key={s} label={`${s} stars`} checked={false} onChange={() => {}} />
      ))}
    </Group>
    <Group title="Board type">
      {["All inclusive", "Half board", "Breakfast included", "Room only"].map((b) => (
        <CheckRow key={b} label={b} checked={false} onChange={() => {}} />
      ))}
    </Group>
    <Group title="Trip duration">
      {["Weekend", "5–7 days", "7–10 days", "14+ days"].map((d) => (
        <CheckRow key={d} label={d} checked={false} onChange={() => {}} />
      ))}
    </Group>
    <Group title="Themes" defaultOpen={false}>
      {["Family", "Adults only", "Wellness", "Luxury", "Beachfront", "Remote-work friendly", "Romantic"].map((t) => (
        <CheckRow
          key={t}
          label={t}
          checked={false}
          onChange={() => {}}
          intel={t === "Remote-work friendly" ? "Fast Wi-Fi · quiet" : undefined}
        />
      ))}
    </Group>
    <Group title="Review score" defaultOpen={false}>
      {["Excellent 9+", "Very good 8+", "Good 7+"].map((r) => (
        <CheckRow key={r} label={r} checked={false} onChange={() => {}} />
      ))}
    </Group>
    <Group title="Amenities" defaultOpen={false}>
      {["Pool", "Spa", "Wi-Fi", "Gym", "Beach access", "Airport transfer"].map((a) => (
        <CheckRow key={a} label={a} checked={false} onChange={() => {}} />
      ))}
    </Group>
  </>
);

const CarFilterPanel = () => (
  <>
    <Group title="Car type">
      {["Compact", "SUV", "Estate", "Premium", "Family vehicle", "Luxury"].map((t) => (
        <CheckRow key={t} label={t} checked={false} onChange={() => {}} />
      ))}
    </Group>
    <Group title="Transmission & fuel">
      {["Automatic", "Manual", "Electric (EV)", "Hybrid"].map((t) => (
        <CheckRow
          key={t}
          label={t}
          checked={false}
          onChange={() => {}}
          intel={t === "Electric (EV)" ? "Lower emissions · wallet eligible" : undefined}
        />
      ))}
    </Group>
    <Group title="Pickup">
      {["Pickup at airport", "City center pickup", "Same-day return"].map((t) => (
        <CheckRow key={t} label={t} checked={false} onChange={() => {}} />
      ))}
    </Group>
    <Group title="Conditions" defaultOpen={false}>
      {["Insurance included", "Unlimited mileage", "No deposit required", "Free cancellation"].map((c) => (
        <CheckRow
          key={c}
          label={c}
          checked={false}
          onChange={() => {}}
          intel={c === "Insurance included" ? "Lower disruption risk" : undefined}
        />
      ))}
    </Group>
    <Group title="Supplier quality" defaultOpen={false}>
      {["Top-rated suppliers (8+)", "Hertz", "Sixt", "Europcar", "Avis"].map((s) => (
        <CheckRow key={s} label={s} checked={false} onChange={() => {}} />
      ))}
    </Group>
  </>
);

const RailFilterPanel = () => (
  <>
    <Group title="Stops & transfers">
      {["Direct", "1 transfer", "2+ transfers"].map((s) => (
        <CheckRow
          key={s}
          label={s}
          checked={false}
          onChange={() => {}}
          intel={s === "Direct" ? "Low transfer stress" : undefined}
        />
      ))}
    </Group>
    <Group title="Class">
      {["Standard", "First class", "Sleeper"].map((c) => (
        <CheckRow key={c} label={c} checked={false} onChange={() => {}} />
      ))}
    </Group>
    <Group title="Travixis intelligence" hint="European-premium rail">
      <CheckRow
        label="City-center arrival"
        checked={false}
        onChange={() => {}}
        intel="Skip airport transfer time"
      />
      <CheckRow
        label="Lower emissions"
        checked={false}
        onChange={() => {}}
        intel="Greener than equivalent flight"
      />
      <CheckRow
        label="Wallet-eligible routes"
        checked={false}
        onChange={() => {}}
      />
      <div className="flex flex-wrap gap-1.5 pt-1">
        {[
          { icon: MapPin, label: "City-center arrival" },
          { icon: Leaf, label: "Lower emissions" },
          { icon: Wallet, label: "Wallet-eligible" },
          { icon: Zap, label: "Low transfer stress" },
        ].map((c) => (
          <span
            key={c.label}
            className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/30 px-2 py-0.5 text-[10.5px] text-muted-foreground"
          >
            <c.icon className="h-2.5 w-2.5" /> {c.label}
          </span>
        ))}
      </div>
    </Group>
    <Group title="Operator" defaultOpen={false}>
      {["Eurostar", "TGV INOUI", "Trenitalia", "DB", "Renfe", "ÖBB"].map((o) => (
        <CheckRow key={o} label={o} checked={false} onChange={() => {}} />
      ))}
    </Group>
    <Group title="Departure window" defaultOpen={false}>
      <div className="grid grid-cols-2 gap-1.5">
        {["Early morning", "Morning", "Afternoon", "Evening"].map((t) => (
          <span
            key={t}
            className="rounded-md border border-border/60 px-2 py-1.5 text-[11px] text-muted-foreground text-center hover:bg-muted/40 cursor-pointer transition-base"
          >
            {t}
          </span>
        ))}
      </div>
    </Group>
  </>
);

const Inner = (props: Props) => {
  if (props.searchType === "hotels" || props.searchType === "packages") return <HotelFilterPanel />;
  if (props.searchType === "cars") return <CarFilterPanel />;
  if (props.searchType === "rail") return <RailFilterPanel />;
  return <FlightFilterPanel {...props} />;
};

const TypeIcon = ({ t }: { t: SearchType }) => {
  const Icon =
    t === "hotels" ? Hotel :
    t === "packages" ? PackageIcon :
    t === "cars" ? Car :
    t === "rail" ? TrainFront :
    Plane;
  return <Icon className="h-3.5 w-3.5" />;
};

export const ResultsFilters = (props: Props) => {
  const label = props.searchType.charAt(0).toUpperCase() + props.searchType.slice(1);
  return (
    <aside className="hidden lg:block w-[260px] shrink-0">
      <div className="sticky top-20 rounded-2xl border bg-card p-4 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[hsl(var(--primary-soft))] text-primary">
              <TypeIcon t={props.searchType} />
            </span>
            <div>
              <p className="text-sm font-semibold">Refine {label.toLowerCase()}</p>
              <p className="text-[11px] text-muted-foreground tabular-nums">{props.resultCount} matching</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={props.onClear}>
            Clear
          </Button>
        </div>
        <div className="-mx-1">
          <Inner {...props} />
        </div>
      </div>
    </aside>
  );
};

export const MobileFiltersButton = (props: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden sticky top-16 z-20 -mx-4 px-4 py-2 bg-background/85 backdrop-blur border-b border-border/60">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-between">
            <span className="inline-flex items-center gap-2">
              <FilterIcon className="h-4 w-4" /> Filters
            </span>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {props.resultCount} results
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-primary" /> Refine results
            </SheetTitle>
          </SheetHeader>
          <div className="mt-2">
            <Inner {...props} />
          </div>
          <div className="sticky bottom-0 mt-4 flex gap-2 bg-background pt-3 border-t border-border/60">
            <Button variant="ghost" size="sm" className="flex-1" onClick={props.onClear}>
              Clear all
            </Button>
            <Button variant="hero" size="sm" className="flex-1" onClick={() => setOpen(false)}>
              Show {props.resultCount} results
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const ActiveFilterChips = ({
  filters,
  defaults,
  onChange,
  onClear,
}: {
  filters: FlightFilters;
  defaults: FlightFilters;
  onChange: (next: FlightFilters) => void;
  onClear: () => void;
}) => {
  const chips: { label: string; clear: () => void }[] = useMemo(() => {
    const c: { label: string; clear: () => void }[] = [];
    if (filters.maxPrice !== defaults.maxPrice)
      c.push({ label: `Up to €${filters.maxPrice}`, clear: () => onChange({ ...filters, maxPrice: defaults.maxPrice }) });
    filters.stops.forEach((s) =>
      c.push({ label: s, clear: () => onChange({ ...filters, stops: filters.stops.filter((x) => x !== s) }) }),
    );
    filters.airlines.forEach((a) =>
      c.push({ label: a, clear: () => onChange({ ...filters, airlines: filters.airlines.filter((x) => x !== a) }) }),
    );
    if (filters.baggageIncluded)
      c.push({ label: "Baggage included", clear: () => onChange({ ...filters, baggageIncluded: false }) });
    if (filters.refundableOnly)
      c.push({ label: "Refundable", clear: () => onChange({ ...filters, refundableOnly: false }) });
    if (filters.lowStressOnly)
      c.push({ label: "Low stress", clear: () => onChange({ ...filters, lowStressOnly: false }) });
    return c;
  }, [filters, defaults, onChange]);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <BadgeSoft variant="primary">
        <Sparkles className="h-3 w-3" /> {chips.length} active
      </BadgeSoft>
      {chips.map((c) => (
        <button
          key={c.label}
          onClick={c.clear}
          className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card px-2.5 py-1 text-xs text-foreground hover:border-primary/40 hover:text-primary transition-base"
        >
          {c.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        onClick={onClear}
        className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline ml-1"
      >
        Clear all
      </button>
    </div>
  );
};
