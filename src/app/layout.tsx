import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leadership Hub | Procurement Senior Leadership",
  description:
    "Secure, invite-only collaboration platform for Procurement Senior Leadership",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
