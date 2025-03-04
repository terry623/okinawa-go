import "./globals.css";
import "./pwa.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import PWAHandler from "./pwa-handler";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Okinawa Go",
  description: "Your travel companion for Okinawa",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Okinawa Go",
  },
  icons: {
    apple: "/icons/travel.png",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/travel.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-launch-1242x2688.png"
        />
      </head>
      <body className={inter.className}>
        <PWAHandler />
        {children}
        <Script src="/ios-pwa.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
