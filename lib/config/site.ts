/** Production site origin for canonical URLs and absolute links. */
export function getSiteOrigin(): string {
  const url = process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    return "https://logos.vsl-base.com";
  }
  return "http://localhost:3000";
}
