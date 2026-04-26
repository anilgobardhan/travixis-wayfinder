import { FileText, Ticket, Receipt, Stamp, ShieldCheck, Upload, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeSoft } from "@/components/BadgeSoft";
import { toast } from "sonner";

const uploadDisabledMsg = "Document upload will be available after account setup.";

type Doc = { name: string; type: string; size: string; icon: React.ComponentType<{ className?: string }>; variant: "primary" | "success" | "accent" | "warning"; };

const docs: Doc[] = [
  { name: "TAP TP671 · Boarding pass", type: "Ticket", size: "PDF · 142 KB", icon: Ticket, variant: "primary" },
  { name: "TAP TP664 · Boarding pass", type: "Ticket", size: "PDF · 138 KB", icon: Ticket, variant: "primary" },
  { name: "Memmo Alfama · Booking confirmation", type: "Booking", size: "PDF · 96 KB", icon: FileText, variant: "accent" },
  { name: "Travixis invoice #TX-10428", type: "Invoice", size: "PDF · 64 KB", icon: Receipt, variant: "success" },
  { name: "Travel insurance policy", type: "Insurance", size: "PDF · 211 KB", icon: ShieldCheck, variant: "success" },
];

const sections = [
  { title: "Tickets & boarding passes", icon: Ticket, filter: "Ticket" },
  { title: "Booking confirmations", icon: FileText, filter: "Booking" },
  { title: "Invoices", icon: Receipt, filter: "Invoice" },
  { title: "Visa documents", icon: Stamp, filter: "Visa" },
  { title: "Insurance", icon: ShieldCheck, filter: "Insurance" },
];

const DocumentsPage = () => {
  return (
    <div className="container max-w-5xl space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <BadgeSoft variant="primary">Document vault</BadgeSoft>
          <h1 className="mt-3 text-3xl font-bold">Your trip documents</h1>
          <p className="mt-1 text-muted-foreground">All papers for your trip — tickets, bookings, insurance — in one secure place.</p>
        </div>
        <Button variant="hero" onClick={() => toast.info(uploadDisabledMsg)}>
          <Upload className="h-4 w-4" /> Upload document
        </Button>
      </div>

      {/* Upload card (frontend-only, disabled) */}
      <button
        type="button"
        onClick={() => toast.info(uploadDisabledMsg)}
        className="block w-full rounded-2xl border-2 border-dashed bg-card p-8 text-center cursor-not-allowed opacity-80 hover:border-primary/40 transition-base"
      >
        <Upload className="h-6 w-6 mx-auto text-primary" />
        <p className="mt-2 font-medium">Drop a file here or click to upload</p>
        <p className="text-xs text-muted-foreground">{uploadDisabledMsg}</p>
      </button>

      {sections.map((s) => {
        const items = docs.filter((d) => d.type === s.filter);
        return (
          <section key={s.title}>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <s.icon className="h-4 w-4 text-primary" /> {s.title}
            </h2>
            {items.length === 0 ? (
              <div className="mt-3 rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
                No {s.title.toLowerCase()} yet.
              </div>
            ) : (
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                {items.map((d) => (
                  <DocCard key={d.name} doc={d} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

const DocCard = ({ doc }: { doc: Doc }) => {
  const Icon = doc.icon;
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card flex items-center gap-4">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-[hsl(var(--primary-soft))] text-primary shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{doc.name}</p>
        <p className="text-xs text-muted-foreground">{doc.size}</p>
      </div>
      <Button variant="ghost" size="icon" aria-label="View" onClick={() => toast.info("Document preview coming soon.")}><Eye className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" aria-label="Download" onClick={() => toast.info("Document download coming soon.")}><Download className="h-4 w-4" /></Button>
    </div>
  );
};

export default DocumentsPage;
