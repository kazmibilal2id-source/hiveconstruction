import { cn } from "@/lib/utils";

export function Badge({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-brand-gold/40 bg-brand-gold/10 px-2.5 py-1 text-xs font-semibold text-amber-200",
        className
      )}
    >
      {children}
    </span>
  );
}
