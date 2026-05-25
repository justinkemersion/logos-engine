import { fluxJson } from "./client";
import type { TokenRow } from "@/lib/types/entities";

export async function listTokensForPassage(
  sub: string,
  passageId: string,
): Promise<TokenRow[]> {
  return fluxJson<TokenRow[]>(
    sub,
    `/tokens?passage_id=eq.${encodeURIComponent(passageId)}&order=token_index.asc`,
  );
}
