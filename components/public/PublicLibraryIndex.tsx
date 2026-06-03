import Link from "next/link";
import { PublicWorkCard } from "./PublicWorkCard";
import { ODYSSEY_1_1_HREF } from "@/lib/public/routes";
import type { PassageRow, WorkRow } from "@/lib/types/entities";

const AUTHOR_ORDER = ["Homer", "Plato"];

const buttonSecondary =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--muted)]";

function groupByAuthor(worksWithPassages: { work: WorkRow; passages: PassageRow[] }[]) {
  const groups = new Map<string, { work: WorkRow; passages: PassageRow[] }[]>();

  for (const item of worksWithPassages) {
    const author = item.work.author;
    const list = groups.get(author) ?? [];
    list.push(item);
    groups.set(author, list);
  }

  const authors = Array.from(groups.keys()).sort((a, b) => {
    const ai = AUTHOR_ORDER.indexOf(a);
    const bi = AUTHOR_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  return authors.map((author) => ({ author, works: groups.get(author)! }));
}

export function PublicLibraryIndex({
  worksWithPassages,
}: {
  worksWithPassages: { work: WorkRow; passages: PassageRow[] }[];
}) {
  const groups = groupByAuthor(worksWithPassages);

  return (
    <div className="px-6 py-10">
      <h1
        className="text-3xl font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Library
      </h1>
      <p className="mt-3 max-w-xl text-base text-[var(--muted-fg)] leading-relaxed">
        Begin with the Greek. Move gently through literal meaning, readable translation, and the
        choices hidden between them.
      </p>
      <Link href={ODYSSEY_1_1_HREF} className={`mt-6 ${buttonSecondary}`}>
        Explore Odyssey 1.1
      </Link>

      <div className="mt-14 space-y-14">
        {groups.map(({ author, works }) => (
          <section key={author}>
            <h2
              className="mb-6 text-2xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {author}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {works.map(({ work, passages }) => (
                <PublicWorkCard key={work.id} work={work} passages={passages} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
