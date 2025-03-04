import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Okinawa Go",
  description: "Your travel companion for Okinawa",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Okinawa Go",
  },
  viewport: {
    width: "device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: false,
  },
  manifest: "/manifest.json",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="apple-touch-icon" href="/icons/travel.png"></link>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
