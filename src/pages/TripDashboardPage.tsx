import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Plane,
  Hotel,
  CheckCircle2,
  Clock,
  FileText,
  Luggage,
  Bell,
  LifeBuoy,
  AlertTriangle,
  MapPin,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeSoft } from "@/components/BadgeSoft";
import { api, type SearchRequestSnapshot } from "@/lib/api";
import { TripTimeline, SmartAlertsCenter, TripHealthOverview } from "@/components/trip/TripIntelligence";
import { WalletOverviewModule, SharedTripFundingModule, BudgetAndPaymentModule } from "@/components/wallet/WalletIntelligence";

// "2026-04-29" -> "Wed, 29 Apr"
const formatDate = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

// "2026-04-29" + "2026-05-03" -> "29 Apr — 3 May 2026"
const formatDateRange = (a?: string | null, b?: string | null): string => {
  if (!a && !b) return "";
  const da = a ? new Date(a) : null;
  const db = b ? new Date(b) : null;
  const fmtPart = (d: Date | null) =>
    d && !Number.isNaN(d.getTime())
      ? d.toLocaleDateString(undefined, { day: "numeric", month: "short" })
      : "";
  const year =
    db && !Number.isNaN(db.getTime())
      ? db.getFullYear()
      : da && !Number.isNaN(da.getTime())
      ? da.getFullYear()
      : "";
  const left = fmtPart(da);
  const right = fmtPart(db);
  if (left && right) return `${left} — ${right}${year ? ` ${year}` : ""}`;
  return left || right;
};

const daysUntil = (iso?: string | null): number | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  const ms = d.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

const TripDashboardPage = () => {
  const [params] = useSearchParams();
  const searchId = params.get("id") || undefined;

  const [tripRequest, setTripRequest] = useState<SearchRequestSnapshot | null>(null);

  useEffect(() => {
    if (!searchId) {
      setTripRequest(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getSearch(searchId);
        if (cancelled) return;
        setTripRequest(data?.request ?? null);
      } catch {
        if (cancelled) return;
        setTripRequest(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchId]);

  const hasLiveTrip = Boolean(searchId && tripRequest);
  const fromCode = (tripRequest?.from ?? "").toUpperCase();
  const toCode = (tripRequest?.to ?? "").toUpperCase();
  const headerTitle =
    fromCode && toCode ? `${fromCode} → ${toCode}` : "Demo trip";
  const dateRange = formatDateRange(tripRequest?.departDate, tripRequest?.returnDate);
  const travelers =
    typeof tripRequest?.travelers === "number" && tripRequest.travelers >= 1
      ? tripRequest.travelers
      : null;
  const headerSubtitle = (() => {
    if (!hasLiveTrip) return "No live search attached — illustrative content";
    const parts: string[] = [];
    if (dateRange) parts.push(dateRange);
    if (travelers !== null)
      parts.push(`${travelers} ${travelers === 1 ? "traveler" : "travelers"}`);
    return parts.join(" · ");
  })();
  const tripStatusLabel = hasLiveTrip ? "Search ready" : "Demo";
  const daysToGo = daysUntil(tripRequest?.departDate);
  const daysToGoLabel =
    hasLiveTrip && daysToGo !== null ? String(daysToGo) : "—";

  const outboundSubtitle = hasLiveTrip
    ? `${fromCode} → ${toCode} · ${formatDate(tripRequest?.departDate)}`
    : "TAP TP671 · Fri 15 Aug · 06:35 → 08:40";
  const returnSubtitle = hasLiveTrip
    ? `${toCode} → ${fromCode} · ${formatDate(tripRequest?.returnDate)}`
    : "TAP TP664 · Fri 22 Aug · 19:10 → 23:30";
  const hotelSubtitle = hasLiveTrip
    ? `${dateRange} · Not booked yet`
    : "15 — 22 Aug · Deluxe room · Breakfast included";
  const itemStatusVariant: "primary" | "success" | "warning" = hasLiveTrip
    ? "primary"
    : "success";
  const itemStatusLabel = hasLiveTrip ? "Not booked yet" : "Confirmed";

  return (
    <div className="container max-w-6xl space-y-8">
      {/* Back to results */}
      <div>
        <Link
          to={searchId ? `/results?id=${encodeURIComponent(searchId)}` : "/results"}
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to results
        </Link>
      </div>

      {/* Trip overview */}
      <div className="rounded-3xl bg-hero p-8 text-primary-foreground shadow-elevated">
        <BadgeSoft variant="accent" className="bg-white/10 text-white">
          {hasLiveTrip ? "Upcoming trip" : "Demo trip — no live search attached"}
        </BadgeSoft>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold">{headerTitle}</h1>
        <p className="mt-1 text-white/80">{headerSubtitle}</p>
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <Stat label="Days to go" value={daysToGoLabel} />
          <Stat label="Trip status" value={tripStatusLabel} />
          <Stat label="Items booked" value={hasLiveTrip ? "0 / 5" : "4 / 5"} />
        </div>
      </div>

      {/* Disruption alert */}
      <div className="rounded-2xl border bg-[hsl(var(--warning-soft))] p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))] shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Minor schedule update</p>
          <p className="text-sm text-muted-foreground">
            Outbound flight TP671 now departs at 06:35 (was 06:15). No action needed — your booking is updated automatically.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trip items */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your trip</h2>

          <TripItem
            icon={<Plane className="h-5 w-5" />}
            title={
              hasLiveTrip
                ? `Outbound flight · ${fromCode} → ${toCode}`
                : "Outbound flight · AMS → LIS"
            }
            subtitle={outboundSubtitle}
            status={{ label: itemStatusLabel, variant: itemStatusVariant }}
          />
          <TripItem
            icon={<Hotel className="h-5 w-5" />}
            title={hasLiveTrip ? "Hotel (not booked yet)" : "Memmo Alfama Hotel"}
            subtitle={hotelSubtitle}
            status={{ label: itemStatusLabel, variant: itemStatusVariant }}
          />
          <TripItem
            icon={<MapPin className="h-5 w-5" />}
            title={hasLiveTrip ? "Activity (not booked yet)" : "Lisbon walking tour"}
            subtitle={
              hasLiveTrip
                ? "Add experiences once your flight is booked"
                : "Sat 16 Aug · 10:00 · Group of 8"
            }
            status={{ label: itemStatusLabel, variant: itemStatusVariant }}
          />
          <TripItem
            icon={<Plane className="h-5 w-5" />}
            title={
              hasLiveTrip
                ? `Return flight · ${toCode} → ${fromCode}`
                : "Return flight · LIS → AMS"
            }
            subtitle={returnSubtitle}
            status={{ label: itemStatusLabel, variant: itemStatusVariant }}
          />

          {/* Reminders */}
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Bell className="h-4 w-4 text-primary" /> Reminders
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <Reminder when="3 days before">Online check-in opens — we'll do it for you</Reminder>
              <Reminder when="1 day before">Pack: passport, charger, sunscreen</Reminder>
              <Reminder when="On arrival">Airport metro to Alfama — €1.85, 25 min</Reminder>
            </ul>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-4">
          <SideCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            title="Check-in"
            content={
              <>
                <p className="text-sm text-muted-foreground">Auto check-in is enabled for both flights.</p>
                <Button variant="soft" size="sm" className="mt-3 w-full" onClick={() => toast.info("Booking flow coming soon.")}>Manage check-in</Button>
              </>
            }
          />
          <SideCard
            icon={<FileText className="h-4 w-4" />}
            title="Documents"
            content={
              <>
                <p className="text-sm text-muted-foreground">5 documents stored securely.</p>
                <Button asChild variant="soft" size="sm" className="mt-3 w-full">
                  <Link to="/documents">Open vault <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </>
            }
          />
          <SideCard
            icon={<Luggage className="h-4 w-4" />}
            title="Baggage"
            content={
              <ul className="text-sm space-y-1.5 text-muted-foreground">
                <li className="flex justify-between"><span>Carry-on</span><span>2 × 8kg</span></li>
                <li className="flex justify-between"><span>Checked</span><span>2 × 23kg</span></li>
              </ul>
            }
          />
          <SideCard
            icon={<LifeBuoy className="h-4 w-4" />}
            title="Need help?"
            content={
              <>
                <p className="text-sm text-muted-foreground">24/7 support during your trip.</p>
                <Button asChild variant="hero" size="sm" className="mt-3 w-full">
                  <Link to="/support">Get support</Link>
                </Button>
              </>
            }
          />
        </aside>
      </div>

      <TripHealthOverview />

      <div className="grid lg:grid-cols-2 gap-6">
        <TripTimeline />
        <SmartAlertsCenter />
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
    <p className="text-xs uppercase tracking-wide text-white/70">{label}</p>
    <p className="mt-0.5 text-xl font-semibold">{value}</p>
  </div>
);

const TripItem = ({
  icon, title, subtitle, status,
}: {
  icon: React.ReactNode; title: string; subtitle: string;
  status: { label: string; variant: "primary" | "success" | "warning" };
}) => (
  <div className="rounded-2xl border bg-card p-4 md:p-5 shadow-card flex items-center gap-4">
    <div className="grid h-11 w-11 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold truncate">{title}</p>
      <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
    </div>
    <BadgeSoft variant={status.variant} className="hidden sm:inline-flex">
      <Clock className="h-3 w-3" /> {status.label}
    </BadgeSoft>
  </div>
);

const Reminder = ({ when, children }: { when: string; children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <BadgeSoft variant="accent" className="shrink-0">{when}</BadgeSoft>
    <span className="pt-0.5">{children}</span>
  </li>
);

const SideCard = ({ icon, title, content }: { icon: React.ReactNode; title: string; content: React.ReactNode }) => (
  <div className="rounded-2xl border bg-card p-5 shadow-card">
    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      <span className="text-primary">{icon}</span> {title}
    </h3>
    <div className="mt-3">{content}</div>
  </div>
);

export default TripDashboardPage;
