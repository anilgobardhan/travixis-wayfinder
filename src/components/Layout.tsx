import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Compass, Search, LayoutDashboard, FileText, Wallet, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SystemStatus } from "./SystemStatus";
import { Button } from "./ui/button";

const nav = [
  { to: "/search", label: "Search", icon: Search },
  { to: "/trip", label: "My Trips", icon: LayoutDashboard },
  { to: "/wallet", label: "Wallet", icon: Wallet, balance: "€1,420" },
  { to: "/documents", label: "Documents", icon: FileText },
];

export const Layout = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const onLanding = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-hero text-primary-foreground">
              <Compass className="h-4 w-4" />
            </span>
            <span className="text-lg tracking-tight">Travixis</span>
            <span className="ml-1 hidden rounded-full bg-[hsl(var(--accent-soft))] px-2 py-0.5 text-[10px] font-medium text-primary sm:inline">
              TOS
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-base",
                    isActive
                      ? "bg-[hsl(var(--primary-soft))] text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <SystemStatus compact />
            <Button asChild variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-[hsl(var(--primary-soft))]">
              <Link to="/search">Start searching</Link>
            </Button>
          </div>

          <button
            className="md:hidden rounded-md p-2 hover:bg-muted"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t md:hidden">
            <div className="container flex flex-col gap-1 py-3">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                      isActive ? "bg-[hsl(var(--primary-soft))] text-primary" : "text-muted-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
              <div className="px-3 pt-2">
                <SystemStatus compact />
              </div>
            </div>
          </div>
        )}
      </header>

      <main className={cn("flex-1", !onLanding && "py-8")}>
        <Outlet />
      </main>

      <footer className="mt-12 border-t bg-card">
        <div className="container py-10 grid gap-8 md:grid-cols-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-hero text-primary-foreground">
                <Compass className="h-4 w-4" />
              </span>
              Travixis
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              The calm, intelligent way to plan and manage your trip.
            </p>
            <div className="mt-4">
              <SystemStatus />
            </div>
          </div>
          <FooterCol title="Explore" items={["Search", "Destinations", "Flexible travel"]} />
          <FooterCol title="Trips" items={["My trips", "Documents", "Alerts"]} />
          <FooterCol title="Wallet" items={["Travel credits", "Gift travel", "Shared funding", "Coverage"]} />
          <FooterCol title="Trust" items={["Transparency", "Methodology", "AI policy"]} />
          <FooterCol title="Company" items={["About", "Support", "Contact"]} />
        </div>
        <div className="border-t">
          <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Travixis. Travel Operating System.</p>
            <p>Built for clarity, trust and calm travel · AI helps. You decide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FooterCol = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <p className="mb-3 text-sm font-semibold">{title}</p>
    <ul className="space-y-2 text-sm text-muted-foreground">
      {items.map((i) => (
        <li key={i} className="hover:text-foreground transition-base cursor-default">{i}</li>
      ))}
    </ul>
  </div>
);
