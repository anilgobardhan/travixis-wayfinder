import { LifeBuoy, MessageCircle, AlertTriangle, RotateCcw, Sparkles, ShieldCheck, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BadgeSoft } from "@/components/BadgeSoft";
import { toast } from "sonner";

const SupportPage = () => {
  const [message, setMessage] = useState("");
  const cases = [
    { id: "TX-2241", title: "Seat assignment for TP671", status: "open" as const, updated: "2h ago" },
    { id: "TX-2189", title: "Hotel breakfast confirmation", status: "resolved" as const, updated: "Yesterday" },
  ];

  const helpTopics = [
    { icon: AlertTriangle, title: "Disruption help", desc: "Delays, cancellations, missed connections — get rebooked fast." },
    { icon: RotateCcw, title: "Cancel or change", desc: "Request changes within fare rules. We'll handle the provider." },
    { icon: ShieldCheck, title: "Insurance claim", desc: "Start a claim with your travel insurance documents." },
  ];

  return (
    <div className="container max-w-5xl space-y-8">
      <div>
        <BadgeSoft variant="primary"><LifeBuoy className="h-3 w-3" /> Support</BadgeSoft>
        <h1 className="mt-3 text-3xl font-bold">We're with you the whole trip</h1>
        <p className="mt-1 text-muted-foreground">Open a case, get help with disruptions, or talk to our team. AI helps — you decide.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr,360px] gap-6">
        <div className="space-y-6">
          {/* Cases */}
          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your support cases</h2>
            <ul className="mt-4 divide-y">
              {cases.map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.id} · updated {c.updated}</p>
                  </div>
                  <BadgeSoft variant={c.status === "open" ? "warning" : "success"}>
                    {c.status === "open" ? "Open" : "Resolved"}
                  </BadgeSoft>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </section>

          {/* Help topics */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Common help topics</h2>
            <div className="mt-3 grid md:grid-cols-3 gap-3">
              {helpTopics.map((t) => (
                <button key={t.title} className="text-left rounded-2xl border bg-card p-5 shadow-card transition-base hover:shadow-elevated hover:-translate-y-0.5">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary">
                    <t.icon className="h-4 w-4" />
                  </div>
                  <p className="mt-3 font-semibold text-sm">{t.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Contact form */}
          <section className="rounded-2xl border bg-card p-5 md:p-6 shadow-card">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Contact support</h2>
            <p className="mt-1 text-sm text-muted-foreground">A real person will reply within 1 hour during your trip.</p>
            <Textarea className="mt-4 min-h-32" placeholder="Tell us what's happening…" />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline">Save draft</Button>
              <Button variant="hero"><MessageCircle className="h-4 w-4" /> Send message</Button>
            </div>
          </section>
        </div>

        {/* AI assistant explanation */}
        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="rounded-2xl border bg-[hsl(var(--accent-soft))] p-5">
            <BadgeSoft variant="primary"><Sparkles className="h-3 w-3" /> AI assistant</BadgeSoft>
            <h3 className="mt-3 font-semibold">How Travixis AI helps</h3>
            <ul className="mt-3 space-y-2 text-sm text-foreground/80">
              <li>• Reads your itinerary and finds the best rebooking options</li>
              <li>• Drafts emails to airlines or hotels for you to review</li>
              <li>• Explains fare rules, baggage, and refund policies in plain language</li>
            </ul>
            <div className="mt-4 rounded-xl bg-card p-3 text-xs">
              <p className="font-semibold text-primary">Human-in-the-loop</p>
              <p className="mt-1 text-muted-foreground">
                AI suggests. You confirm. No action is taken on your booking without your approval.
              </p>
            </div>
            <Button variant="hero" size="sm" className="mt-4 w-full">
              <Sparkles className="h-4 w-4" /> Ask the assistant
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SupportPage;
