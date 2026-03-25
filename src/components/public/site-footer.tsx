import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics/cookie-settings-button";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div>
          <p className="footer-title">Inkspire</p>
          <p className="footer-copy">
            Český komiksový magazín s vlastním CMS v Next.js, chráněným redakčním
            studiem, serverovou logikou a analytikou pouze po souhlasu.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/">Titulka</Link>
          <Link href="/dashboard">Studio</Link>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
