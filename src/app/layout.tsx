import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Bangers, Comic_Neue } from "next/font/google";
import { ClarityLoader } from "@/components/analytics/clarity-loader";
import { CookieConsentBanner } from "@/components/analytics/cookie-consent";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { absoluteUrl, getBaseUrl, siteConfig } from "@/lib/site";
import { mantineComicTheme } from "@/lib/theme/mantine-comic-theme";
import "./globals.css";
import "./comic-theme.css";

const headingFont = Bangers({
  display: "swap",
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

const bodyFont = Comic_Neue({
  display: "swap",
  variable: "--font-body",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: `${siteConfig.name} | Publishing platform`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: `${siteConfig.name} | Publishing platform`,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <MantineProvider theme={mantineComicTheme}>
          <Notifications />
          <CookieConsentBanner />
          <ClarityLoader />
          <div className="site-shell">
            <SiteHeader />
            <main className="site-main">{children}</main>
            <SiteFooter />
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
