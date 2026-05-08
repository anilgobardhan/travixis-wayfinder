import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Premium empty state — calm, guided, alive (never "unfinished").
 * Used across Travixis surfaces when a list, search or wallet has no items.
 */
export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  examples?: string[];
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({ icon, title, description, examples, action, className }: EmptyStateProps) => (
  <section
    role="status"
    aria-live="polite"
    className={cn(
      "rounded-2xl border border-border/70 bg-card p-8 md:p-10 shadow-card text-center",
      className,
    )}
  >
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[hsl(var(--primary-soft))] text-primary">
      {icon}
    </div>
    <h3 className="mt-4 text-[17px] font-semibold tracking-tight">{title}</h3>
    <p className="mt-1.5 mx-auto max-w-md text-[13px] text-muted-foreground leading-relaxed">{description}</p>
    {examples && examples.length > 0 && (
      <ul className="mt-5 mx-auto flex flex-wrap justify-center gap-1.5 max-w-lg">
        {examples.map((e) => (
          <li
            key={e}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11.5px] text-muted-foreground"
          >
            {e}
          </li>
        ))}
      </ul>
    )}
    {action && <div className="mt-6 inline-flex">{action}</div>}
  </section>
);
