import type { Metadata } from "next";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  metadataBase: new URL('https://sfdan.org'),
  title: {
    default: "SFDAN - Federal Funding Dashboard",
    template: "%s | SFDAN",
  },
  description: "Track IIJA infrastructure funding and procedural compliance scores. Analyze federal spending, compare agency performance, and assess project integrity.",
  keywords: ["IIJA", "infrastructure", "federal funding", "compliance", "procedural integrity", "government spending", "watchdog"],
  authors: [{ name: "SFDAN" }],
  creator: "SFDAN",
  publisher: "SFDAN",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sfdan.org",
    siteName: "SFDAN",
    title: "SFDAN - Federal Funding Dashboard",
    description: "Track IIJA infrastructure funding and procedural compliance scores. Analyze federal spending, compare agency performance, and assess project integrity.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SFDAN - Procedural Integrity Score Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SFDAN - Federal Funding Dashboard",
    description: "Track IIJA infrastructure funding and procedural compliance scores",
    creator: "@sfdan",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://sfdan.org",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <NuqsAdapter>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
