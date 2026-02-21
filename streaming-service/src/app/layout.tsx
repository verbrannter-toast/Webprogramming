"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar";
import { usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const hideNavbar = pathname.startsWith('/watch/');

  return (
    <html lang="en">
      <body className="bg-[#141414]">
        {!hideNavbar && <Navbar />} {/* stays visible on all pages except for the player page */}
        {children}
      </body>
    </html>
  );
}
