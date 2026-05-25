# Dependency exceptions

Documented deviations from the `flux-app-foundry` baseline.

_No exceptions at time of fork (2026-05-24)._

| Package | Pinned version | Reason | Owner | Review date |
|---------|---------------|--------|-------|-------------|
| `@cursor/sdk` | latest minor | First AI editorial pipeline agent (`logos-passage-agent`) | logos-engine | 2026-08-24 |

`@cursor/sdk` local runtime requires native `sqlite3` bindings. `package.json` sets
`pnpm.onlyBuiltDependencies: ["sqlite3"]` so install scripts run. After clone, run
`pnpm install` (not `--ignore-scripts`).
