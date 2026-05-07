import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Compass,
  Search,
  LayoutDashboard,
  FileText,
  Wallet,
  Menu,
  X,
  UserRound,
  Bell,
  Bookmark,
  Sparkles,
  Users,
  Gift,
  LogOut,
  Settings,
  LifeBuoy,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SystemStatus } from "./SystemStatus";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type NavItem = { to: string; label: string; icon: typeof Search; balance?: string };
const nav: NavItem[] = [
  { to: "/search", label: "Search", icon: Search },
  { to: "/my-trips", label: "My Trips", icon: LayoutDashboard },
  { to: "/wallet", label: "Wallet", icon: Wallet, balance: "€1,420" },
  { to: "/documents", label: "Documents", icon: FileText },
];
const mobileExtra: NavItem[] = [
  { to: "/saved-searches", label: "Saved searches", icon: Bookmark },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Travel profile", icon: UserRound },
  { to: "/support", label: "Support", icon: LifeBuoy },
];

export const Layout = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const onLanding = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-[68px] items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2.5 font-semibold text-primary">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-hero text-primary-foreground">
              <Compass className="h-4 w-4" />
            </span>
            <span className="text-lg tracking-tight leading-none">Travixis</span>
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
                    "rounded-md px-3 py-2 text-[13px] font-medium leading-none transition-premium inline-flex items-center gap-2",
                    isActive
                      ? "bg-[hsl(var(--primary-soft))] text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )
                }
              >
                {item.label}
                {item.balance && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--primary-soft))] px-2 py-0.5 text-[10.5px] font-semibold text-primary tabular-nums">
                    <span className="relative grid h-1.5 w-1.5 place-items-center">
                      <span className="absolute inset-0 rounded-full bg-[hsl(var(--success))]/40 ambient-pulse" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
                    </span>
                    {item.balance}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            <SystemStatus compact />
            <span className="h-5 w-px bg-border" aria-hidden />
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--primary-soft))]/60 transition-base"
            >
              <Bell className="h-[17px] w-[17px]" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))] ring-2 ring-background" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-[13px] font-medium text-foreground hover:bg-[hsl(var(--primary-soft))]/60 transition-base ring-1 ring-border/60"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[hsl(var(--primary-soft))] text-primary">
                    <UserRound className="h-3.5 w-3.5" />
                  </span>
                  <span className="hidden lg:inline">Account</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-72 rounded-2xl p-0 border bg-card shadow-[0_24px_60px_-28px_hsl(var(--primary)/0.35),0_8px_24px_-12px_hsl(var(--foreground)/0.08)]"
              >
                <div className="px-4 pt-4 pb-3">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Travel profile</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[hsl(var(--primary-soft))] text-primary">
                      <UserRound className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">Guest traveler</p>
                      <Link to="/login" className="text-[11.5px] text-primary hover:underline">Sign in to personalize</Link>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-[hsl(var(--primary-soft))]/60 px-3 py-2">
                    <div className="flex items-center gap-2 text-[12px] text-primary">
                      <Wallet className="h-3.5 w-3.5" />
                      <span className="font-semibold">€1,420</span>
                      <span className="text-primary/70">· 3 active credits</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10.5px] text-[hsl(var(--success))] font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" /> Active
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-semibold pt-3">Travel</DropdownMenuLabel>
                <DropdownMenuItem asChild><Link to="/my-trips" className="cursor-pointer"><LayoutDashboard className="h-4 w-4" /> My trips</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/saved-searches" className="cursor-pointer"><Bookmark className="h-4 w-4" /> Saved searches</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/wallet" className="cursor-pointer"><Wallet className="h-4 w-4" /> Wallet overview</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/documents" className="cursor-pointer"><FileText className="h-4 w-4" /> Documents</Link></DropdownMenuItem>
                <DropdownMenuLabel className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-semibold pt-3">Intelligence</DropdownMenuLabel>
                <DropdownMenuItem asChild><Link to="/notifications" className="cursor-pointer"><Bell className="h-4 w-4" /> Notifications</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile" className="cursor-pointer"><Sparkles className="h-4 w-4" /> AI recommendations</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile" className="cursor-pointer"><UserRound className="h-4 w-4" /> Travel profile</Link></DropdownMenuItem>
                <DropdownMenuLabel className="text-[10.5px] uppercase tracking-wider text-muted-foreground font-semibold pt-3">Wallet</DropdownMenuLabel>
                <DropdownMenuItem asChild><Link to="/wallet" className="cursor-pointer"><Users className="h-4 w-4" /> Shared funding</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/wallet" className="cursor-pointer"><Gift className="h-4 w-4" /> Gift travel credits</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/profile" className="cursor-pointer"><Settings className="h-4 w-4" /> Travel preferences</Link></DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-muted-foreground"><LogOut className="h-4 w-4" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild variant="hero" size="sm" className="h-9 px-4">
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
        <div className="container py-8 grid gap-6 md:gap-8 md:grid-cols-7">
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
          <FooterCol title="Explore" items={["Search", "Destinations", "Flexible travel", "Rail", "Cars"]} />
          <FooterCol title="Trips" items={["My trips", "Documents", "Alerts"]} />
          <FooterCol title="Wallet" items={["Travel credits", "Gift travel", "Shared funding", "Coverage"]} />
          <FooterCol title="Trust" items={["Transparency", "Methodology", "AI policy"]} />
          <FooterCol title="Help" items={["Support", "Help center", "Contact"]} />
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
    <p className="mb-3 text-[13px] font-semibold tracking-tight text-foreground">{title}</p>
    <ul className="space-y-2 text-[13px] text-muted-foreground/90 leading-relaxed">
      {items.map((i) => (
        <li key={i} className="hover:text-foreground transition-base cursor-default">{i}</li>
      ))}
    </ul>
  </div>
);
