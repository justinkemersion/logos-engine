import type { AuthenticityProfileRow } from "@/lib/types/entities";

const statusPhrases: Record<string, string> = {
  secure: "Securely attributed",
  generally_accepted: "Generally accepted",
  disputed: "Disputed attribution",
  doubtful: "Doubtful attribution",
  spurious: "Spurious",
  oral_tradition: "Oral-formulaic tradition",
  composite_tradition: "Composite tradition",
};

export function PublicTransmissionCard({ profile }: { profile: AuthenticityProfileRow }) {
  const statusLabel = statusPhrases[profile.status] ?? profile.status.replace(/_/g, " ");

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[var(--foreground)]">{statusLabel}</p>
      {profile.confidence_label ? (
        <p className="text-xs text-[var(--muted-fg)]">{profile.confidence_label}</p>
      ) : null}
      <p className="text-sm leading-relaxed text-[var(--foreground)]">{profile.summary}</p>
    </div>
  );
}
