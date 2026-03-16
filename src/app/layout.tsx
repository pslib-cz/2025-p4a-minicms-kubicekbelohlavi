import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Fraunces, Manrope } from "next/font/google";
import { ClarityLoader } from "@/components/analytics/clarity-loader";
import { CookieConsentBanner } from "@/components/analytics/cookie-consent";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { absoluteUrl, getBaseUrl, siteConfig } from "@/lib/site";
import "./globals.css";

const headingFont = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Manrope({
  variable: "--font-body",
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
        <MantineProvider
          theme={{
            primaryColor: "teal",
            defaultRadius: "md",
            fontFamily: "var(--font-body), sans-serif",
            headings: {
              fontFamily: "var(--font-heading), serif",
            },
          }}
        >
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
