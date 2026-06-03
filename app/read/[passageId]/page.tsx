import { notFound, redirect } from "next/navigation";
import {
  getPublicPassage,
  getPublicWorkById,
} from "@/lib/public/passages";
import { isPassageUuid, publicPassageHref } from "@/lib/public/routes";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

/** Redirect legacy UUID public URLs to human-readable slug paths. */
export default async function PublicUuidPassageRedirect({
  params,
}: {
  params: Promise<{ passageId: string }>;
}) {
  const { passageId } = await params;
  if (!isPassageUuid(passageId)) notFound();

  const passage = await safe(() => getPublicPassage(passageId), null);
  if (!passage) notFound();

  const work = await safe(() => getPublicWorkById(passage.work_id), null);
  if (!work) notFound();

  redirect(publicPassageHref(work, passage));
}
