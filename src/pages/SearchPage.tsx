import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Hotel, Package, Car, Bus, Ticket, Search as SearchIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BadgeSoft } from "@/components/BadgeSoft";

type TripType = "flight" | "hotel" | "package" | "car" | "transfer" | "activities";

const tripTypes: { id: TripType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "flight", label: "Flight", icon: Plane },
  { id: "hotel", label: "Hotel", icon: Hotel },
  { id: "package", label: "Package", icon: Package },
  { id: "car", label: "Car", icon: Car },
  { id: "transfer", label: "Transfer", icon: Bus },
  { id: "activities", label: "Activities", icon: Ticket },
];

const sliderOptions = [
  { id: "budget", label: "Budget", values: ["Cheapest", "Balanced", "Premium"] },
  { id: "comfort", label: "Comfort", values: ["Basic", "Comfortable", "Luxury"] },
  { id: "flexibility", label: "Flexibility", values: ["Strict", "Flexible", "Fully flexible"] },
] as const;

const SearchPage = () => {
  const [type, setType] = useState<TripType>("flight");
  const [prefs, setPrefs] = useState<Record<string, number>>({ budget: 1, comfort: 1, flexibility: 1 });
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/results");
  };

  return (
    <div className="container max-w-5xl">
      <div className="mb-8">
        <BadgeSoft variant="accent"><Sparkles className="h-3 w-3" /> Smart search</BadgeSoft>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold">Plan your next trip</h1>
        <p className="mt-2 text-muted-foreground">
          Tell us what matters. We'll handle the comparing, the math and the fine print.
        </p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-6 md:p-8 shadow-card space-y-8">
        {/* Trip type */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Trip type</Label>
          <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-2">
            {tripTypes.map((t) => {
              const Icon = t.icon;
              const active = type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-base",
                    active
                      ? "border-primary bg-[hsl(var(--primary-soft))] text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* From / To */}
        <div className="grid md:grid-cols-2 gap-5">
          <FieldGroup label="From" placeholder="City or airport" defaultValue="Amsterdam (AMS)" />
          <FieldGroup label="To" placeholder="City or airport" defaultValue="Lisbon (LIS)" />
        </div>

        {/* Dates / travelers */}
        <div className="grid md:grid-cols-3 gap-5">
          <FieldGroup label="Departure" type="date" defaultValue="2025-08-15" />
          <FieldGroup label="Return" type="date" defaultValue="2025-08-22" />
          <FieldGroup label="Travelers" placeholder="e.g. 2 adults" defaultValue="2 adults" />
        </div>

        {/* Preferences */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Preferences</Label>
          <div className="mt-3 grid md:grid-cols-3 gap-5">
            {sliderOptions.map((opt) => (
              <div key={opt.id} className="rounded-xl border bg-background p-4">
                <p className="text-sm font-medium">{opt.label}</p>
                <div className="mt-3 flex gap-2">
                  {opt.values.map((v, i) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setPrefs((p) => ({ ...p, [opt.id]: i }))}
                      className={cn(
                        "flex-1 rounded-md px-2 py-2 text-xs font-medium transition-base",
                        prefs[opt.id] === i
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/70"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Travixis searches across providers and shows true total prices — including taxes, baggage and surcharges.
          </p>
          <Button type="submit" variant="hero" size="lg">
            <SearchIcon className="h-4 w-4" /> Search with Travixis
          </Button>
        </div>
      </form>
    </div>
  );
};

const FieldGroup = ({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{label}</Label>
    <Input className="mt-2 h-11" {...props} />
  </div>
);

export default SearchPage;
