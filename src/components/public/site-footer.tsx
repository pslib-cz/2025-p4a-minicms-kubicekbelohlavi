import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics/cookie-settings-button";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div>
          <p className="footer-title">Inkspire</p>
          <p className="footer-copy">
            Next.js publishing platform with Prisma, Auth.js, protected Route
            Handlers, analytics consent, and SEO support.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
