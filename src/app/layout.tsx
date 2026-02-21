import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
