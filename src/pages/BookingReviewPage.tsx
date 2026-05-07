import { Link, useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  Luggage,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Wallet,
  Plane,
  Clock,
  Lock,
  CheckCircle2,
  CloudSun,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeSoft } from "@/components/BadgeSoft";
import { toast } from "sonner";

const fmt = (n: number, c = "EUR") => {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${c} ${Math.round(n)}`;
  }
};

const BookingReviewPage = () => {
  const [params] = useSearchParams();
  const optionId = params.get("option") || "primary";
  const searchId = params.get("id") || undefined;

  const route = "AMS ↔ LIS";
  const airline = "TAP Air Portugal · Direct";

  const breakdown = [
    { label: "Base fare (2 travelers)", value: 412 },
    { label: "Taxes & airport fees", value: 86 },
    { label: "Checked baggage included", value: 0 },
    { label: "Travixis service", value: 0 },
  ];
  const total = breakdown.reduce((s, b) => s + b.value, 0);
  const walletBalance = 1420;
  const walletApply = Math.min(walletBalance, Math.round(total * 0.6));
  const remaining = total - walletApply;

  return (
    <div className="container max-w-6xl space-y-7">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link
            to={searchId ? `/option/${optionId}?id=${encodeURIComponent(searchId)}` : `/option/${optionId}`}
            className="text-[12.5px] text-muted-foreground hover:text-foreground"
          >
            ← Back to trip details
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Review your booking</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Travixis advises — you decide. Nothing is charged on this screen.
          </p>
        </div>
        <BadgeSoft variant="primary"><ShieldCheck className="h-3 w-3" /> Calm choice</BadgeSoft>
      </div>

      <div className="grid lg:grid-cols-[1fr,360px] gap-6">
        <div className="space-y-5">
          {/* Trip summary */}
          <section className="result-card rounded-2xl border border-border/70 bg-card p-6 shadow-card">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-muted-foreground">Trip summary</p>
                <h2 className="mt-1.5 text-[18px] font-semibold tracking-tight">{airline}</h2>
                <p className="text-[12.5px] text-muted-foreground">{route} · 2 travelers · 14–21 Jul 2026</p>
              </div>
              <BadgeSoft variant="success"><Plane className="h-3 w-3" /> Direct both ways</BadgeSoft>
            </div>
            <ul className="mt-5 space-y-3 border-t border-border/60 pt-4">
              <li className="flex items-center gap-3 text-[13px]">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">Tue 14 Jul</span>
                <span className="text-muted-foreground">06:15 AMS → 08:40 LIS · TP671 · 3h 25m</span>
              </li>
              <li className="flex items-center gap-3 text-[13px]">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">Tue 21 Jul</span>
                <span className="text-muted-foreground">19:10 LIS → 23:30 AMS · TP664 · 3h 20m</span>
              </li>
            </ul>
          </section>

          {/* Clarity */}
          <div className="grid sm:grid-cols-2 gap-4">
            <section className="result-card rounded-2xl border border-border/70 bg-card p-5 shadow-card">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold"><Luggage className="h-3.5 w-3.5 text-primary" /> Baggage</p>
              <ul className="mt-3 space-y-1.5 text-[12.5px] text-muted-foreground">
                <li>Carry-on (8kg) — included</li>
                <li>Checked bag (23kg) — included</li>
                <li>Extra bag — €45 each way</li>
              </ul>
            </section>
            <section className="result-card rounded-2xl border border-border/70 bg-card p-5 shadow-card">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold"><RotateCcw className="h-3.5 w-3.5 text-primary" /> Cancellation & changes</p>
              <ul className="mt-3 space-y-1.5 text-[12.5px] text-muted-foreground">
                <li>Free cancellation up to 24h before departure</li>
                <li>Date change up to 7 days before · €30 fee after</li>
                <li>Name changes not allowed</li>
              </ul>
            </section>
          </div>

          {/* AI reassurance */}
          <section className="result-card rounded-2xl border border-primary/20 bg-gradient-to-b from-[hsl(var(--primary-soft))]/60 to-transparent p-6 shadow-card">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Why this is a calm choice
            </p>
            <ul className="mt-3 space-y-2 text-[13px] text-foreground/85 leading-relaxed">
              <li className="flex items-start gap-2"><ShieldCheck className="h-3.5 w-3.5 mt-1 text-primary shrink-0" /> Historically smoother route — fewer disruptions over the past 90 days.</li>
              <li className="flex items-start gap-2"><Timer className="h-3.5 w-3.5 mt-1 text-primary shrink-0" /> Better overnight recovery on arrival.</li>
              <li className="flex items-start gap-2"><CloudSun className="h-3.5 w-3.5 mt-1 text-primary shrink-0" /> Stable arrival weather window.</li>
              <li className="flex items-start gap-2"><Wallet className="h-3.5 w-3.5 mt-1 text-primary shrink-0" /> Your wallet covers most of it — no large checkout surprise.</li>
            </ul>
            <p className="mt-4 text-[11px] text-primary/70">Travixis advises — you decide.</p>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-elevated">
            <p className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-muted-foreground">True total price</p>
            <p className="mt-1.5 text-[34px] font-semibold tracking-tight tabular-nums">{fmt(total)}</p>
            <p className="text-[11.5px] text-muted-foreground">All fees included · 2 travelers</p>
            <ul className="mt-4 space-y-2 text-[12.5px] border-t border-border/60 pt-4">
              {breakdown.map((b) => (
                <li key={b.label} className="flex justify-between text-muted-foreground">
                  <span>{b.label}</span>
                  <span className="font-medium text-foreground tabular-nums">{fmt(b.value)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl bg-[hsl(var(--primary-soft))]/70 p-4">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-primary"><Wallet className="h-3.5 w-3.5" /> Wallet credit</span>
                <span className="font-semibold text-primary tabular-nums">−{fmt(walletApply)}</span>
              </div>
              <p className="mt-1 text-[11px] text-primary/80">Wallet covers {Math.round((walletApply / total) * 100)}% of this booking.</p>
              <div className="mt-3 flex items-center justify-between text-[13px] border-t border-primary/15 pt-3">
                <span className="font-medium">Remaining to pay</span>
                <span className="font-semibold tabular-nums">{fmt(remaining)}</span>
              </div>
            </div>

            <Button
              variant="hero"
              size="lg"
              className="mt-5 w-full cta-bloom"
              onClick={() => toast.success("This is a UI preview. No payment was taken.")}
            >
              Continue booking <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="mt-3 inline-flex items-center gap-1.5 justify-center w-full text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" /> No payment is taken on this screen.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-card">
            <p className="flex items-center gap-2 text-[12px] font-semibold"><CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--success))]" /> Included with Travixis</p>
            <ul className="mt-3 space-y-1.5 text-[12px] text-muted-foreground">
              <li>24/7 disruption monitoring</li>
              <li>Calm rebooking assistance</li>
              <li>Wallet refund on cancellation</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingReviewPage;
