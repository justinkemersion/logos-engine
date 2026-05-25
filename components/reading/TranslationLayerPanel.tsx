import { ReviewBadge } from "./ReviewBadge";
import { ReviewControls } from "./ReviewControls";
import {
  isAiPromoted,
  listAiLayerAlternatives,
} from "@/lib/reading/review-display";
import type { TranslationLayerRow } from "@/lib/types/entities";

export function TranslationLayerPanel({
  passageId,
  title,
  layerName,
  primaryLayer,
  allLayers,
  emptyMessage,
  contentClassName = "text-base leading-relaxed",
  useSerif = false,
}: {
  passageId: string;
  title: string;
  layerName: string;
  primaryLayer: TranslationLayerRow | undefined;
  allLayers: TranslationLayerRow[];
  emptyMessage: string;
  contentClassName?: string;
  useSerif?: boolean;
}) {
  const alternatives = listAiLayerAlternatives(allLayers, layerName, primaryLayer);
  const showCanonicalLabel =
    primaryLayer != null && alternatives.length > 0 && !isAiPromoted(primaryLayer);

  return (
    <div>
      {title ? (
        <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
          {title}
        </p>
      ) : null}
      {primaryLayer ? (
        <>
          {showCanonicalLabel ? (
            <p className="mb-1 text-[0.65rem] uppercase tracking-wide text-[var(--muted-fg)]">
              Canonical
            </p>
          ) : null}
          <p
            className={contentClassName}
            style={useSerif ? { fontFamily: "var(--font-serif)" } : undefined}
          >
            {primaryLayer.content}
          </p>
          {isAiPromoted(primaryLayer) ? (
            <>
              <ReviewBadge row={primaryLayer} />
              <ReviewControls
                passageId={passageId}
                target="translation_layer"
                row={primaryLayer}
              />
            </>
          ) : null}
        </>
      ) : (
        <p className="text-sm text-[var(--muted-fg)]">{emptyMessage}</p>
      )}
      {alternatives.map((layer) => (
        <AiLayerAlternativeBlock
          key={layer.id}
          passageId={passageId}
          layer={layer}
          contentClassName={contentClassName}
          useSerif={useSerif}
        />
      ))}
    </div>
  );
}

function AiLayerAlternativeBlock({
  passageId,
  layer,
  contentClassName,
  useSerif,
}: {
  passageId: string;
  layer: TranslationLayerRow;
  contentClassName: string;
  useSerif: boolean;
}) {
  return (
    <div className="mt-4 rounded-md border border-amber-200/80 bg-amber-50/50 px-3 py-3 dark:border-amber-900/50 dark:bg-amber-950/20">
      <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-600">
        AI-promoted alternative
      </p>
      <p
        className={contentClassName}
        style={useSerif ? { fontFamily: "var(--font-serif)" } : undefined}
      >
        {layer.content}
      </p>
      <ReviewBadge row={layer} />
      <ReviewControls passageId={passageId} target="translation_layer" row={layer} />
    </div>
  );
}
