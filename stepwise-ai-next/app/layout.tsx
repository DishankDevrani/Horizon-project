import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stepwise AI — Learn without the overwhelm",
  description: "A calm, AI-powered roadmap to your next skill.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
