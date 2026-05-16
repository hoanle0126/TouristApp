import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { CartProvider } from "@/src/components/travel/CartProvider";
import { FloatingActionStack } from "@/src/components/ui/FloatingActionStack";
import { getSiteContentSettings } from "@/src/lib/api/settings";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteContent = await getSiteContentSettings();
    return {
      title: `${siteContent.siteName} | ${siteContent.siteTagline}`,
      description: siteContent.siteDescription,
    };
  } catch {
    return {
      title: "CURATOR | High-End Travel Monograph",
      description: "Curated destinations and exclusive travel experiences.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <FloatingActionStack />
        </CartProvider>
      </body>
    </html>
  );
}
