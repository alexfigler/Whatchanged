import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://whatchanged.example"),
  title: "What Changed — AI for Small Business Owners",
  description:
    "Catch up on AI. Then put it to work in your business. Courses, custom builds, and a community for owners who want to learn AI and use it on their own terms.",
  openGraph: {
    title: "What Changed — AI for Small Business Owners",
    description:
      "Catch up on AI. Then put it to work in your business.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "What Changed — AI for Small Business Owners",
    description:
      "Catch up on AI. Then put it to work in your business.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
