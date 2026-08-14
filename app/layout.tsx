import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safarnama",
  description:
    "Some songs don't just play. They take you back. A cinematic Indian road-trip music player for KK and Atif Aslam playlists.",
  metadataBase: new URL("https://nostalgia-road.local"),
  icons: {
    icon: "/favicon.jpg",
  },
  openGraph: {
    title: "Safarnama",
    description:
      "Songs for long drives, old memories and roads we never forget.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#241B14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
