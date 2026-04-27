import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Sparkles, Loader2, CheckCircle2, ShieldCheck, Wand2, ArrowRight,
  Plane, Wallet, Gauge, Lightbulb, Quote, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeSoft } from "@/components/BadgeSoft";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const STEPS = [
  "Understanding your trip goal",
  "Searching routes and combinations",
  "Calculating true total price",
  "Scoring stress / risk",
  "Comparing alternatives",
  "Preparing recommendation",
] as const;

const SIM_UPDATES = [
  "Found a cheaper route via Lisbon",
  "Checking baggage and hidden fees",
  "Comparing direct vs one-stop options",
  "Found lower stress alternative",
  "Recalculating total price",
  "Best value option updated",
];

const POLL_INTERVAL_MS = 1500;
const SIM_STEP_MS = 1100;

type SearchStatus = {
  status?: string; // "queued" | "running" | "completed" | "failed" | ...
  step?: number;
  progress?: number; // 0-100
  updates?: string[];
  message?: string;
};

const AutopilotRunPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q") || "Find the best weekend trip from Amsterdam, anywhere in Europe.";
  const searchId = params.get("id") || undefined;
  const offline = params.get("offline") === "1";

  const [stepIdx, setStepIdx] = useState(0);
  const [progressOverride, setProgressOverride] = useState<number | null>(null);
  const [updates, setUpdates] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelled = useRef(false);

  const useRealBackend = Boolean(searchId) && !offline;

  // Real backend: poll GET /search/:id for status updates
  useEffect(() => {
    if (!useRealBackend || !searchId) return;
    cancelled.current = false;

    let timer: number | null = null;
    const poll = async () => {
      try {
        const data = (await api.getSearch(searchId)) as SearchStatus;
        if (cancelled.current) return;

        if (typeof data.step === "number") setStepIdx(Math.min(data.step, STEPS.length));
        if (typeof data.progress === "number") setProgressOverride(Math.max(0, Math.min(100, data.progress)));
        if (Array.isArray(data.updates)) setUpdates(data.updates);

        const status = (data.status || "").toLowerCase();
        if (status === "completed" || status === "done" || status === "ready") {
          setStepIdx(STEPS.length);
          setProgressOverride(100);
          setDone(true);
          return;
        }
        if (status === "failed" || status === "error") {
          setError(data.message || "Search failed. Please try again.");
          return;
        }
        timer = window.setTimeout(poll, POLL_INTERVAL_MS);
      } catch (e) {
        if (cancelled.current) return;
        setError("Lost connection to search service. Retrying…");
        timer = window.setTimeout(poll, POLL_INTERVAL_MS * 2);
      }
    };

    poll();
    return () => {
      cancelled.current = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [useRealBackend, searchId]);

  // Simulated fallback: only when there is no searchId (preview mode)
  useEffect(() => {
    if (useRealBackend) return;
    if (stepIdx >= STEPS.length) {
      setDone(true);
      return;
    }
    const t = window.setTimeout(() => setStepIdx((i) => i + 1), SIM_STEP_MS);
    return () => window.clearTimeout(t);
  }, [stepIdx, useRealBackend]);

  useEffect(() => {
    if (useRealBackend) return;
    let i = 0;
    const id = window.setInterval(() => {
      if (i >= SIM_UPDATES.length) {
        window.clearInterval(id);
        return;
      }
      setUpdates((u) => [...u, SIM_UPDATES[i]]);
      i += 1;
    }, 900);
    return () => window.clearInterval(id);
  }, [useRealBackend]);

  const progress = useMemo(() => {
    if (progressOverride !== null) return progressOverride;
    return Math.min(100, Math.round((Math.min(stepIdx, STEPS.length) / STEPS.length) * 100));
  }, [stepIdx, progressOverride]);

  return (
    <div className="container max-w-5xl space-y-8">
      <div>
        <BadgeSoft variant="accent"><Wand2 className="h-3 w-3" /> Autopilot Search</BadgeSoft>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold">
          {done ? "Recommendation ready" : "Travixis is searching for you…"}
        </h1>
        <p className="mt-2 text-muted-foreground inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Travixis does not book automatically. You stay in control.
        </p>
      </div>

      {/* Connection / mode banner */}
      {!useRealBackend && (
        <div className="flex items-start gap-2 rounded-xl border border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning-soft,var(--accent-soft)))] px-4 py-3 text-sm text-foreground">
          <AlertTriangle className="h-4 w-4 mt-0.5 text-[hsl(var(--warning))]" />
          <span>
            Running in <strong>preview mode</strong> — backend search not connected.
            Results below are illustrative until <code>POST /search</code> is available.
          </span>
        </div>
      )}
      {useRealBackend && error && (
        <div className="flex items-start gap-2 rounded-xl border border-[hsl(var(--warning))]/30 bg-[hsl(var(--accent-soft))] px-4 py-3 text-sm text-foreground">
          <AlertTriangle className="h-4 w-4 mt-0.5 text-[hsl(var(--warning))]" />
          <span>{error}</span>
        </div>
      )}

      {/* Goal echo */}
      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="flex items-start gap-3">
          <Quote className="h-5 w-5 text-[hsl(var(--accent))] shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Your trip goal</p>
            <p className="mt-1 text-sm md:text-base">{query}</p>
          </div>
        </div>
      </div>

      {/* Live panel */}
      <div className="grid lg:grid-cols-[1.1fr,1fr] gap-5">
        {/* Steps */}
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Search progress</h2>
            <span className="text-sm font-medium text-primary">{progress}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--accent))] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ul className="mt-6 space-y-3">
            {STEPS.map((s, i) => {
              const isDone = i < stepIdx;
              const isCurrent = i === stepIdx && !done;
              return (
                <li key={s} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full border text-xs",
                      isDone && "border-[hsl(var(--success))] bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]",
                      isCurrent && "border-primary bg-[hsl(var(--primary-soft))] text-primary",
                      !isDone && !isCurrent && "border-border text-muted-foreground"
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isCurrent ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      isDone && "text-foreground",
                      isCurrent && "text-foreground font-medium",
                      !isDone && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {s}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Live updates feed */}
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="font-semibold">Live updates</h2>
          <p className="text-xs text-muted-foreground">Streaming insights as Travixis explores options.</p>
          <ul className="mt-4 space-y-2">
            {updates.length === 0 && (
              <li className="text-sm text-muted-foreground inline-flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Warming up engines…
              </li>
            )}
            {updates.map((u, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-lg bg-[hsl(var(--accent-soft))] px-3 py-2 text-sm text-primary animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                {u}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Result preview */}
      {done && (
        <section className="rounded-2xl border bg-card p-6 md:p-8 shadow-elevated space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <BadgeSoft variant="success"><CheckCircle2 className="h-3 w-3" /> Recommendation ready</BadgeSoft>
              <h2 className="mt-2 text-2xl font-bold">3 best options found for you</h2>
              <p className="text-sm text-muted-foreground">Best Value · Cheapest · Lowest Stress — all with true total price.</p>
            </div>
            <Button
              variant="hero"
              size="lg"
              onClick={() =>
                navigate(
                  `/results?from=autopilot${searchId ? `&id=${encodeURIComponent(searchId)}` : ""}`
                )
              }
            >
              View recommendations <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <PreviewCard
              icon={<Sparkles className="h-4 w-4" />}
              variant="primary"
              title="Best Value"
              total="€285"
              caption="Direct · 3h 25m · baggage included"
            />
            <PreviewCard
              icon={<Wallet className="h-4 w-4" />}
              variant="accent"
              title="Cheapest"
              total="€187"
              caption="1 stop · 5h 10m · trade-offs explained"
            />
            <PreviewCard
              icon={<Gauge className="h-4 w-4" />}
              variant="success"
              title="Lowest Stress"
              total="€312"
              caption="Direct · fully flexible · low risk"
            />
          </div>

          <div className="rounded-xl bg-[hsl(var(--primary-soft))] p-4 text-sm text-primary inline-flex items-start gap-2">
            <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              <span className="font-semibold">Travixis only assists.</span>{" "}
              Each option includes a clear explanation of why it's recommended — you make the final call.
            </span>
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link to="/search">Edit my goal</Link>
        </Button>
        {!done && !useRealBackend && (
          <Button variant="ghost" onClick={() => { setStepIdx(STEPS.length); setDone(true); }}>
            Skip animation
          </Button>
        )}
      </div>
    </div>
  );
};

const PreviewCard = ({
  icon, title, total, caption, variant,
}: {
  icon: React.ReactNode;
  title: string;
  total: string;
  caption: string;
  variant: "primary" | "accent" | "success";
}) => (
  <div className="rounded-xl border bg-background p-5 transition-base hover:shadow-card">
    <BadgeSoft variant={variant}>{icon} {title}</BadgeSoft>
    <p className="mt-3 text-2xl font-bold">{total}</p>
    <p className="text-xs text-muted-foreground">true total price</p>
    <p className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1.5">
      <Plane className="h-3 w-3" /> {caption}
    </p>
  </div>
);

export default AutopilotRunPage;
