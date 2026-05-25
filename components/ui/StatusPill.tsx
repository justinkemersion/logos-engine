import { cn } from "@/lib/ui/cn";

const statusStyles: Record<string, string> = {
  secure: "bg-emerald-100 text-emerald-800",
  generally_accepted: "bg-green-100 text-green-800",
  disputed: "bg-amber-100 text-amber-800",
  doubtful: "bg-amber-100 text-amber-800",
  spurious: "bg-[var(--muted)] text-[var(--muted-fg)]",
  oral_tradition: "bg-blue-100 text-blue-800",
  composite_tradition: "bg-blue-100 text-blue-800",
  draft: "bg-[var(--muted)] text-[var(--muted-fg)]",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-[var(--muted)] text-[var(--muted-fg)] line-through",
  revised: "bg-[var(--accent)] text-[var(--accent-fg)]",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        statusStyles[status] ?? "bg-[var(--muted)] text-[var(--muted-fg)]",
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
