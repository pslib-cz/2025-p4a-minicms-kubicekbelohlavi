import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Archivo_Black, IBM_Plex_Sans } from "next/font/google";
import { ClarityLoader } from "@/components/analytics/clarity-loader";
import { CookieConsentBanner } from "@/components/analytics/cookie-consent";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { SpiderWebCursor } from "@/components/public/spider-web-cursor";
import { absoluteUrl, getBaseUrl, siteConfig } from "@/lib/site";
import { mantineComicTheme } from "@/lib/theme/mantine-comic-theme";
import "./globals.css";
import "./comic-theme.css";
import "./magazine-theme.css";
import "./spiderverse-effects.css";

const headingFont = Archivo_Black({
  display: "swap",
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const bodyFont = IBM_Plex_Sans({
  display: "swap",
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: `${siteConfig.name} | Spider-Verse komiksový magazín`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: `${siteConfig.name} | Spider-Verse komiksový magazín`,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Spider-Verse komiksový magazín`,
    description: siteConfig.description,
  },
  icons: {
    icon: "/favicon.svg",
  },
  verification: {
    google: "POxahttUfI0JvCBsFQmvxbP0SrkDdWF-g-j457jTOxk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${headingFont.variable} ${bodyFont.variable}`} lang="cs" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={mantineComicTheme}>
          <Notifications />
          <CookieConsentBanner />
          <ClarityLoader />
          <SpiderWebCursor />
          <div className="site-shell">
            {/* Floating geometric shapes */}
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
            {/* Web lines */}
            <div className="shape shape-6"></div>
            <div className="shape shape-7"></div>
            <SiteHeader />
            <main className="site-main">{children}</main>
            <SiteFooter />
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
