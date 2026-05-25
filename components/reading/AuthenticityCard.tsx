import type { AuthenticityProfileRow } from "@/lib/types/entities";
import { StatusPill } from "@/components/ui/StatusPill";

const signalLabels: Record<string, string> = {
  ancient_attribution: "Ancient attribution",
  manuscript_tradition: "Manuscript tradition",
  stylometry: "Stylometry",
  vocabulary: "Vocabulary analysis",
  doctrinal_fit: "Doctrinal fit",
  tone_anomaly: "Tone anomaly",
  oral_formulaic_structure: "Oral-formulaic structure",
  later_editorial_suspicion: "Later editorial suspicion",
};

export function AuthenticityCard({ profile }: { profile: AuthenticityProfileRow }) {
  const signals = profile.signals ?? {};

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <StatusPill status={profile.status} />
        <span className="text-xs font-medium text-[var(--foreground)]">
          {profile.confidence_label}
        </span>
      </div>
      <p className="text-xs text-[var(--muted-fg)] leading-relaxed mb-3">
        {profile.summary}
      </p>
      {Object.keys(signals).length > 0 ? (
        <ul className="space-y-1">
          {Object.entries(signals).map(([key, value]) => (
            <li key={key} className="flex items-center gap-2 text-xs">
              <span
                className={
                  value === true
                    ? "text-green-600"
                    : value === false
                      ? "text-[var(--muted-fg)]"
                      : "text-amber-600"
                }
              >
                {value === true ? "✓" : value === false ? "—" : "?"}
              </span>
              <span className={value ? "text-[var(--foreground)]" : "text-[var(--muted-fg)]"}>
                {signalLabels[key] ?? key.replace(/_/g, " ")}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
