/**
 * Logos Engine does not use a demo seed script.
 * All corpus data is seeded via sql/migrations/0007_seed_mvp_texts.sql
 * pushed with `flux push`.
 *
 * See docs/LOGOS_WORKFLOW.md for setup instructions.
 */
console.log(
  "Logos Engine seed data lives in sql/migrations/0007_seed_mvp_texts.sql.\n" +
    "Run: flux push sql/migrations/0007_seed_mvp_texts.sql",
);
