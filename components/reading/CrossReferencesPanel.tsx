import type { CrossReferenceRow, PassageRow } from "@/lib/types/entities";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const relationshipLabels: Record<string, string> = {
  echo: "Echo",
  contrast: "Contrast",
  shared_concept: "Shared concept",
  same_term: "Same term",
  mythic_parallel: "Mythic parallel",
  political_parallel: "Political parallel",
  tone_parallel: "Tone parallel",
};

export function CrossReferencesPanel({
  crossRefs,
  currentPassageId,
  passageMap,
}: {
  crossRefs: CrossReferenceRow[];
  currentPassageId: string;
  passageMap: Record<string, PassageRow>;
}) {
  if (crossRefs.length === 0) {
    return (
      <p className="text-xs text-[var(--muted-fg)]">No cross references for this passage.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {crossRefs.map((ref) => {
        const otherId =
          ref.source_passage_id === currentPassageId
            ? ref.target_passage_id
            : ref.source_passage_id;
        const other = passageMap[otherId];
        return (
          <li key={ref.id} className="text-xs">
            <Link
              href={`/passages/${otherId}`}
              className="font-medium text-[var(--accent)] hover:underline"
            >
              {other ? `${other.citation_ref}` : otherId.slice(0, 8) + "…"}
            </Link>
            <div className="mt-0.5 flex items-center gap-1.5">
              <Badge className="text-[0.6rem]">
                {relationshipLabels[ref.relationship_type] ?? ref.relationship_type}
              </Badge>
            </div>
            {ref.note ? (
              <p className="mt-1 text-[var(--muted-fg)] leading-relaxed">{ref.note}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
