import { cn } from "@/lib/utils";

type Variant = "neutral" | "success" | "warning" | "danger" | "accent" | "primary";

interface BadgeSoftProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  icon?: React.ReactNode;
}

const styles: Record<Variant, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-[hsl(var(--success-soft))] text-[hsl(var(--success))]",
  warning: "bg-[hsl(var(--warning-soft))] text-[hsl(var(--warning))]",
  danger: "bg-[hsl(var(--destructive-soft))] text-destructive",
  accent: "bg-[hsl(var(--accent-soft))] text-primary",
  primary: "bg-[hsl(var(--primary-soft))] text-primary",
};

export const BadgeSoft = ({ children, variant = "neutral", className, icon }: BadgeSoftProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
      styles[variant],
      className
    )}
  >
    {icon}
    {children}
  </span>
);
