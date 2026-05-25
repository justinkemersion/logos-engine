import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPassage } from "@/lib/flux/passages";
import { getWork } from "@/lib/flux/works";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

export default async function PassagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const sub = session!.user!.id;

  let passage = null;
  let work = null;
  try {
    passage = await getPassage(sub, id);
    if (passage) {
      work = await getWork(sub, passage.work_id);
    }
  } catch {
    /* Flux may be unavailable during local UI dev */
  }

  if (!passage) notFound();

  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        title="Reading desk coming in Slice 5"
        hint={`${work?.title ?? "Work"} · ${passage.citation_ref} · ${passage.greek_text}`}
      />
    </div>
  );
}
