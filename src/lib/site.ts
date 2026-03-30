export const siteConfig = {
  name: "Spider-Verse",
  description:
    "Komiksový magazín z paralelních světů — Spider-Verse CMS postavený na Next.js s redakčním studiem a příběhy napříč dimenzemi.",
  pageSize: 6,
  dashboardPageSize: 8,
  consentRevision: 2,
};

export function getBaseUrl() {
  const value =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";

  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${getBaseUrl()}/`).toString();
}
