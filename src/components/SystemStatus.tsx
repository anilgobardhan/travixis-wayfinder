import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type Status = "checking" | "ok" | "degraded" | "down";

export const SystemStatus = ({ compact = false }: { compact?: boolean }) => {
  const [api_, setApi] = useState<Status>("checking");
  const [db, setDb] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        await api.health();
        if (!cancelled) setApi("ok");
      } catch {
        if (!cancelled) setApi("down");
      }
      try {
        await api.dbHealth();
        if (!cancelled) setDb("ok");
      } catch {
        if (!cancelled) setDb("down");
      }
    };
    check();
    const interval = setInterval(check, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const overall: Status =
    api_ === "ok" && db === "ok"
      ? "ok"
      : api_ === "checking" || db === "checking"
      ? "checking"
      : api_ === "down" && db === "down"
      ? "down"
      : "degraded";

  const dotColor = {
    checking: "bg-muted-foreground",
    ok: "bg-[hsl(var(--success))]",
    degraded: "bg-[hsl(var(--warning))]",
    down: "bg-destructive",
  }[overall];

  const label = {
    checking: "Checking systems…",
    ok: "All systems operational",
    degraded: "Partial outage",
    down: "Service unavailable",
  }[overall];

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <span className={cn("h-2 w-2 rounded-full animate-pulse", dotColor)} />
        {label}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", dotColor)} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-xs text-muted-foreground">Live status</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <Row label="API" status={api_} />
        <Row label="Database" status={db} />
      </div>
    </div>
  );
};

const Row = ({ label, status }: { label: string; status: Status }) => {
  const color = {
    checking: "bg-muted-foreground",
    ok: "bg-[hsl(var(--success))]",
    degraded: "bg-[hsl(var(--warning))]",
    down: "bg-destructive",
  }[status];
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5">
        <span className={cn("h-1.5 w-1.5 rounded-full", color)} />
        <span className="capitalize">{status === "checking" ? "…" : status}</span>
      </span>
    </div>
  );
};
