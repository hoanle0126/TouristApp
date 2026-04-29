import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { FloatingActionStack } from "@/src/components/ui/FloatingActionStack";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CURATOR | High-End Travel Monograph",
  description: "Curated destinations and exclusive travel experiences.",
};

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
        {children}
        <FloatingActionStack />
      </body>
    </html>
  );
}
