import type { TranslationLayerRow } from "@/lib/types/entities";

export function PublicLayerCard({
  title,
  layer,
  emptyMessage = "Not available.",
  useSerif = false,
  hideTitle = false,
}: {
  title: string;
  layer: TranslationLayerRow | undefined;
  emptyMessage?: string;
  useSerif?: boolean;
  hideTitle?: boolean;
}) {
  return (
    <div>
      {!hideTitle && title ? (
        <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
          {title}
        </p>
      ) : null}
      {layer ? (
        <p
          className="text-lg leading-loose text-[var(--foreground)]"
          style={useSerif ? { fontFamily: "var(--font-serif)" } : undefined}
        >
          {layer.content}
        </p>
      ) : (
        <p className="text-sm text-[var(--muted-fg)]">{emptyMessage}</p>
      )}
    </div>
  );
}
