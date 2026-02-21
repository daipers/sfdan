import type { Metadata } from "next";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const metadata: Metadata = {
  title: "SFDAN - Federal Funding Dashboard",
  description: "Track IIJA infrastructure funding and procedural compliance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
