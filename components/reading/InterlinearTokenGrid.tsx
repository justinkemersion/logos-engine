import { TokenRow as TokenRowComponent } from "./TokenRow";
import { TokenInspector } from "./TokenInspector";
import { TranslationLayerPanel } from "./TranslationLayerPanel";
import type { PassageRow, TokenRow, TranslationLayerRow, TranslationVariantRow } from "@/lib/types/entities";

export function InterlinearTokenGrid({
  passage,
  tokens,
  translationVariants,
  translationLayers,
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
  translationLayers: TranslationLayerRow[];
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
      {showLiteralLayer ? (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <TranslationLayerPanel
            passageId={passageId}
            title="Literal"
            layerName="literal"
            primaryLayer={literalLayer}
            allLayers={translationLayers}
            emptyMessage="No literal layer available."
          />
        </div>
      ) : null}
    </div>
  );
}
