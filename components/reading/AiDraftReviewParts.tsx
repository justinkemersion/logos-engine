import { cn } from "@/lib/ui/cn";

export function DraftSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
        {title}
      </p>
      {children}
    </section>
  );
}

export function CopyButton({
  label,
  copied,
  onClick,
  className,
}: {
  label: string;
  copied: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded border border-[var(--border)] px-2 py-0.5 text-[0.65rem] uppercase tracking-wide transition-colors hover:bg-[var(--muted)]",
        className,
      )}
    >
      {copied ? "Copied" : `Copy ${label}`}
    </button>
  );
}

export function formatDraftDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "unknown date";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function warningLevelClass(level: "low" | "medium" | "high"): string {
  if (level === "high") return "bg-amber-100 text-amber-800";
  if (level === "medium") return "bg-amber-50 text-amber-700";
  return "bg-[var(--muted)] text-[var(--muted-fg)]";
}
