"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignInOut = () => {
    // 1. Remove user from storage
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    // 2. Close dropdown
    setShowDropdown(false);
    // 3. Redirect to login
    router.push('/login');
  };

  const handleAccount = () => {
    setShowDropdown(false);
    router.push('/account');
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
      isScrolled ? "bg-zinc-900" : "bg-gradient-to-b from-black/80 to-transparent"
    }`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-red-600 text-2xl md:text-3xl font-bold">REFLIX</Link>
          <ul className="hidden md:flex gap-6 text-sm text-zinc-300">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/watchlist" className="hover:text-white transition">My Watchlist</Link></li>
          </ul>
        </div>

        <div className="flex items-center gap-6 text-white relative">
          <Search className="w-5 h-5 cursor-pointer" />
          
          {/* Profile Group */}
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-4 w-48 bg-black border border-zinc-700 py-2 shadow-xl rounded">
                { !localStorage.getItem('userId') ? (
                  <button 
                    onClick={handleSignInOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-zinc-800 transition text-left">
                    Sign In
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleAccount}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-zinc-800 transition text-left">
                      Account
                    </button>
                    <button 
                      onClick={handleSignInOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-zinc-800 transition text-left">
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};