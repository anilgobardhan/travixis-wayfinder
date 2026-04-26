import { Link } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeSoft } from "@/components/BadgeSoft";

const TripDashboardPage = () => {
  return (
    <div className="container max-w-6xl space-y-8">
      {/* Trip overview */}
      <div className="rounded-3xl bg-hero p-8 text-primary-foreground shadow-elevated">
        <BadgeSoft variant="accent" className="bg-white/10 text-white">Upcoming trip</BadgeSoft>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold">Lisbon, Portugal</h1>
        <p className="mt-1 text-white/80">15 — 22 August 2025 · 2 travelers</p>
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <Stat label="Days to go" value="42" />
          <Stat label="Trip status" value="Confirmed" />
          <Stat label="Items booked" value="4 / 5" />
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
            title="Outbound flight · AMS → LIS"
            subtitle="TAP TP671 · Fri 15 Aug · 06:35 → 08:40"
            status={{ label: "Check-in opens in 41d", variant: "primary" }}
          />
          <TripItem
            icon={<Hotel className="h-5 w-5" />}
            title="Memmo Alfama Hotel"
            subtitle="15 — 22 Aug · Deluxe room · Breakfast included"
            status={{ label: "Confirmed", variant: "success" }}
          />
          <TripItem
            icon={<MapPin className="h-5 w-5" />}
            title="Lisbon walking tour"
            subtitle="Sat 16 Aug · 10:00 · Group of 8"
            status={{ label: "Confirmed", variant: "success" }}
          />
          <TripItem
            icon={<Plane className="h-5 w-5" />}
            title="Return flight · LIS → AMS"
            subtitle="TAP TP664 · Fri 22 Aug · 19:10 → 23:30"
            status={{ label: "Confirmed", variant: "success" }}
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
                <Button variant="soft" size="sm" className="mt-3 w-full">Manage check-in</Button>
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
