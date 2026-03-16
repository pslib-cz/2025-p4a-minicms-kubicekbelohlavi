export const siteConfig = {
  name: "Inkspire",
  description:
    "A modern publishing platform built with Next.js App Router, Prisma, Auth.js, and a client-driven editorial dashboard.",
  pageSize: 6,
  dashboardPageSize: 8,
  consentRevision: 1,
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
