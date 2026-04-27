import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Plane, Hotel, Package, Car, Bus, Ticket,
  Search as SearchIcon, Sparkles, Wand2, Settings2, ShieldCheck, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { BadgeSoft } from "@/components/BadgeSoft";
import { api } from "@/lib/api";
import { extractTripFields } from "@/lib/extractTripFields";

type TripType = "flight" | "hotel" | "package" | "car" | "transfer" | "activities";
type Mode = "autopilot" | "classic";

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

const examplePrompts = [
  "I want to travel from Amsterdam to Lisbon next Friday and return Monday, cheapest possible but not too stressful.",
  "Find me a family trip to Turkey in August with hotel, baggage and good refund flexibility.",
  "I want a mountain/nature trip for 2 adults under €900, flexible dates.",
  "Find the best weekend trip from Amsterdam, anywhere in Europe, cheapest good option.",
];

const SearchPage = () => {
  const [mode, setMode] = useState<Mode>("autopilot");
  const [type, setType] = useState<TripType>("flight");
  const [prefs, setPrefs] = useState<Record<string, number>>({ budget: 1, comfort: 1, flexibility: 1 });
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onClassicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/results");
  };

  const onAutopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const q = prompt.trim() || examplePrompts[0];
    const fields = extractTripFields(q);

    const payload = {
      mode: "autopilot" as const,
      prompt: q,
      from: fields.from,
      to: fields.to,
      departDate: fields.departDate,
      returnDate: fields.returnDate,
      travelers: fields.travelers,
      preferences: {
        budget: ["cheapest", "balanced", "premium"][prefs.budget] ?? "balanced",
        comfort: ["basic", "comfortable", "luxury"][prefs.comfort] ?? "comfortable",
        flexibility: ["strict", "flexible", "fully_flexible"][prefs.flexibility] ?? "flexible",
      },
    };

    setSubmitting(true);
    try {
      const res = await api.search(payload);
      const searchId = res?.id;
      if (searchId) {
        try {
          sessionStorage.setItem("travixis:lastSearchId", searchId);
          sessionStorage.setItem(`travixis:search:${searchId}`, JSON.stringify({ payload, createdAt: Date.now() }));
        } catch {
          /* storage not available — continue */
        }
        navigate(`/autopilot?id=${encodeURIComponent(searchId)}&q=${encodeURIComponent(q)}`);
      } else {
        toast.error("Search did not return an id. Continuing in preview mode.");
        navigate(`/autopilot?q=${encodeURIComponent(q)}`);
      }
    } catch (err) {
      toast.warning("Backend unreachable — showing Autopilot in preview mode.");
      navigate(`/autopilot?q=${encodeURIComponent(q)}&offline=1`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-5xl">
      <div className="mb-8">
        <BadgeSoft variant="accent"><Sparkles className="h-3 w-3" /> Travixis Autopilot</BadgeSoft>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold">Plan your next trip</h1>
        <p className="mt-2 text-muted-foreground">
          Describe your trip in your own words — or use classic search. Travixis does the comparing, the math and the fine print.
        </p>
      </div>

      {/* Mode tabs */}
      <div className="inline-flex rounded-xl border bg-card p-1 shadow-card">
        <ModeTab active={mode === "autopilot"} onClick={() => setMode("autopilot")} icon={<Wand2 className="h-4 w-4" />} label="Autopilot Search" hint="AI-powered" />
        <ModeTab active={mode === "classic"} onClick={() => setMode("classic")} icon={<Settings2 className="h-4 w-4" />} label="Classic Search" hint="Manual filters" />
      </div>

      {mode === "autopilot" ? (
        <form onSubmit={onAutopilotSubmit} className="mt-5 rounded-2xl border bg-card p-6 md:p-8 shadow-card space-y-6">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--accent-soft))] text-primary shrink-0">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Tell Travixis what you want</h2>
              <p className="text-sm text-muted-foreground">
                Natural language — origin, destination, dates, budget, vibe, anything that matters.
              </p>
            </div>
          </div>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={examplePrompts[0]}
            className="min-h-[140px] text-base leading-relaxed"
          />

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Try an example</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {examplePrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-base"
                >
                  {p.length > 80 ? p.slice(0, 78) + "…" : p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 pt-2">
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Travixis does not book automatically. You stay in control.
            </p>
            <Button type="submit" variant="hero" size="lg">
              <Sparkles className="h-4 w-4" /> Start Autopilot Search
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={onClassicSubmit} className="mt-5 rounded-2xl border bg-card p-6 md:p-8 shadow-card space-y-8">
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

          <div className="grid md:grid-cols-2 gap-5">
            <FieldGroup label="From" placeholder="City or airport" defaultValue="Amsterdam (AMS)" />
            <FieldGroup label="To" placeholder="City or airport" defaultValue="Lisbon (LIS)" />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <FieldGroup label="Departure" type="date" defaultValue="2025-08-15" />
            <FieldGroup label="Return" type="date" defaultValue="2025-08-22" />
            <FieldGroup label="Travelers" placeholder="e.g. 2 adults" defaultValue="2 adults" />
          </div>

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
      )}
    </div>
  );
};

const ModeTab = ({
  active, onClick, icon, label, hint,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; hint: string }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-base",
      active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
    )}
  >
    {icon}
    <span>{label}</span>
    <span className={cn("text-[10px] uppercase tracking-wide", active ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
      · {hint}
    </span>
  </button>
);

const FieldGroup = ({
  label, ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <Label className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{label}</Label>
    <Input className="mt-2 h-11" {...props} />
  </div>
);

export default SearchPage;
