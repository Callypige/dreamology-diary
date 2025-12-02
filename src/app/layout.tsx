import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import SessionWrapper from "@/components/ui/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dreamology",
  description: "Votre journal de rêves",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-slate-800 to-black text-white min-h-screen`}>

        <SessionWrapper>
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-28">{children}</main>
          </SessionWrapper>
      </body>
    </html>
  );
}
