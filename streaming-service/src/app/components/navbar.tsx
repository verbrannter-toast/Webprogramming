"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserAvatar from './UserAvatar';

const API_URL = 'http://localhost:5000';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  const fetchAvatar = () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setAvatarUrl(null);
      return;
    }

    fetch(`${API_URL}/account/avatar/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setAvatarUrl(data.avatarUrl || null);
      })
      .catch(() => {
        setAvatarUrl(null);
      });
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchAvatar();

    const handleAvatarUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ avatarUrl?: string | null }>;
      const nextAvatarUrl = customEvent.detail?.avatarUrl;

      if (typeof nextAvatarUrl === 'string' || nextAvatarUrl === null) {
        setAvatarUrl(nextAvatarUrl);
        return;
      }

      fetchAvatar();
    };

    window.addEventListener('avatar-updated', handleAvatarUpdate);

    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate);
    };
  }, []);

  const handleSignInOut = () => {
    // 1. Remove user from storage
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    setAvatarUrl(null);
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
            <>|</>
            <li><Link href="/genres/comedy" className="hover:text-white transition">Comedy</Link></li>
            <li><Link href="/genres/action" className="hover:text-white transition">Action</Link></li>
            <li><Link href="/genres/horror" className="hover:text-white transition">Horror</Link></li>
            <li><Link href="/genres/romance" className="hover:text-white transition">Romance</Link></li>
            <li><Link href="/genres/sci-fi" className="hover:text-white transition">Sci-Fi</Link></li>
            <li><Link href="/genres/drama" className="hover:text-white transition">Drama</Link></li>
            <li><Link href="/genres/animation" className="hover:text-white transition">Animation</Link></li>
            <li><Link href="/genres/documentary" className="hover:text-white transition">Documentary</Link></li>
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
              <UserAvatar
                avatarUrl={avatarUrl}
                sizeClass='w-8 h-8'
                className='border-zinc-500'
              />
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