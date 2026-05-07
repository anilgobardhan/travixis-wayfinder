import { Bell, TrendingDown, ShieldCheck, Sparkles, CloudSun, Wallet } from "lucide-react";
import { BadgeSoft } from "@/components/BadgeSoft";

const items = [
  { icon: TrendingDown, tone: "success", title: "AMS → BCN dropped €34", desc: "Historically a good week to book.", time: "2h ago" },
  { icon: CloudSun, tone: "primary", title: "Quieter arrival window — Lisbon", desc: "Mid-week return looks calmer than Sunday.", time: "Yesterday" },
  { icon: ShieldCheck, tone: "primary", title: "Reliable carrier confirmed", desc: "TAP on-time performance steady at 91% this month.", time: "2d ago" },
  { icon: Wallet, tone: "success", title: "Emma gifted €120 to your honeymoon fund", desc: "Wallet now covers 78% of your saved Tuscany trip.", time: "3d ago" },
  { icon: Sparkles, tone: "primary", title: "Better recovery timing detected", desc: "An alternative arrival 90 minutes earlier reduces fatigue.", time: "5d ago" },
];

const NotificationsPage = () => (
  <div className="container max-w-3xl space-y-7">
    <header>
      <p className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-muted-foreground">Travel OS</p>
      <h1 className="mt-1.5 text-3xl font-semibold tracking-tight inline-flex items-center gap-2.5">
        <Bell className="h-6 w-6 text-primary" /> Notifications
      </h1>
      <p className="mt-1 text-[13px] text-muted-foreground">Travixis only interrupts when it matters.</p>
    </header>

    <ol className="space-y-2.5">
      {items.map((n, i) => (
        <li key={i} className="result-card rounded-2xl border border-border/70 bg-card p-4 shadow-card flex items-start gap-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
            <n.icon className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13.5px] font-semibold tracking-tight">{n.title}</p>
              <span className="text-[11px] text-muted-foreground shrink-0">{n.time}</span>
            </div>
            <p className="mt-0.5 text-[12.5px] text-muted-foreground leading-relaxed">{n.desc}</p>
          </div>
          <BadgeSoft variant={n.tone as "primary" | "success"}>AI</BadgeSoft>
        </li>
      ))}
    </ol>
  </div>
);

export default NotificationsPage;
