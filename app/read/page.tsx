import { PublicReaderShell } from "@/components/public/PublicReaderShell";
import { PublicLibraryIndex } from "@/components/public/PublicLibraryIndex";
import { listPublicWorks, listPublicPassagesByWork } from "@/lib/public/passages";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function PublicReadIndexPage() {
  const works = await safe(() => listPublicWorks(), []);

  const worksWithPassages = await Promise.all(
    works.map(async (work) => {
      const passages = await safe(() => listPublicPassagesByWork(work.id), []);
      return { work, passages };
    }),
  );

  return (
    <PublicReaderShell>
      <PublicLibraryIndex worksWithPassages={worksWithPassages} />
    </PublicReaderShell>
  );
}
