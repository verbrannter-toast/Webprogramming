'use client';

import { ChevronDown, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
      isScrolled ? "bg-zinc-900" : "bg-linear-to-b from-black/80 to-transparent"
    }`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center gap-8">
          <h1 className="text-red-600 text-2xl md:text-3xl font-bold cursor-pointer">REFLIX</h1>
          <ul className="hidden md:flex gap-6 text-sm text-zinc-300">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/watchlist" className="hover:text-white transition">My Watchlist</Link></li>
          </ul>
        </div>
        <div className="flex items-center gap-6 text-white">
          <Search className="w-5 h-5 cursor-pointer" />
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center"><User className="w-5 h-5" /></div>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </nav>
  );
};