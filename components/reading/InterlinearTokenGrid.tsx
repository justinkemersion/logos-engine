import { TokenRow as TokenRowComponent } from "./TokenRow";
import { TokenInspector } from "./TokenInspector";
import { ReviewBadge } from "./ReviewBadge";
import { ReviewControls } from "./ReviewControls";
import type { PassageRow, TokenRow, TranslationLayerRow, TranslationVariantRow } from "@/lib/types/entities";

export function InterlinearTokenGrid({
  passage,
  tokens,
  translationVariants,
  selectedToken,
  onTokenClick,
  onCloseInspector,
  literalLayer,
  showLiteralLayer,
  passageId,
}: {
  passage: PassageRow;
  tokens: TokenRow[];
  translationVariants: TranslationVariantRow[];
  selectedToken: TokenRow | null;
  onTokenClick: (token: TokenRow) => void;
  onCloseInspector: () => void;
  literalLayer: TranslationLayerRow | undefined;
  showLiteralLayer: boolean;
  passageId: string;
}) {
  return (
    <div className="space-y-4">
      <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
        {passage.citation_ref}
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-3 items-start">
        {tokens.length > 0 ? (
          tokens.map((token) => (
            <div key={token.id}>
              <TokenRowComponent
                token={token}
                isSelected={selectedToken?.id === token.id}
                onClick={onTokenClick}
              />
              {selectedToken?.id === token.id ? (
                <TokenInspector
                  token={token}
                  variants={translationVariants}
                  onClose={onCloseInspector}
                />
              ) : null}
            </div>
          ))
        ) : (
          <p className="text-xl leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
            {passage.greek_text}
          </p>
        )}
      </div>
      {showLiteralLayer && literalLayer ? (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--muted-fg)]">
            Literal
          </p>
          <p className="text-base leading-relaxed text-[var(--foreground)]">
            {literalLayer.content}
          </p>
          <ReviewBadge row={literalLayer} />
          <ReviewControls
            passageId={passageId}
            target="translation_layer"
            row={literalLayer}
          />
        </div>
      ) : null}
    </div>
  );
}
