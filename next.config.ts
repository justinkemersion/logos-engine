import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @cursor/sdk ships non-JS assets (e.g. LICENSE.txt) and native deps (sqlite3).
  // Keep them out of the Turbopack graph; load at runtime on the server only.
  serverExternalPackages: ["@cursor/sdk", "sqlite3"],
};

export default nextConfig;
