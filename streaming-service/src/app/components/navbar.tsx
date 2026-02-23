"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import UserAvatar from './UserAvatar';
import { GENRE_CONFIGS } from '../genres/config';

const API_URL = 'http://localhost:5000';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  // Re-fetch on every route change so navigating after login always loads the avatar.
  useEffect(() => {
    fetchAvatar();
  }, [pathname]);

  useEffect(() => {
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

  useEffect(() => {
    if (pathname !== '/search') {
      setSearchQuery('');
      setIsSearchOpen(false);
      return;
    }

    const urlQuery = searchParams.get('q') ?? '';
    setSearchQuery(urlQuery);

    if (urlQuery) {
      setIsSearchOpen(true);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    searchInputRef.current?.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const trimmedQuery = searchQuery.trim();

      if (!trimmedQuery) {
        if (pathname === '/search') {
          router.push('/');
        }
        return;
      }

      const currentQuery = searchParams.get('q') ?? '';

      if (pathname !== '/search' || currentQuery !== trimmedQuery) {
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isSearchOpen, pathname, router, searchParams, searchQuery]);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');

    if (pathname === '/search') {
      router.push('/');
    }
  };

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
            {GENRE_CONFIGS.map((genreConfig) => (
              <li key={genreConfig.slug}>
                <Link href={`/genres/${genreConfig.slug}`} className="hover:text-white transition">
                  {genreConfig.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-6 text-white relative">
          <div className="flex items-center">
            {!isSearchOpen ? (
              <button
                type="button"
                onClick={handleOpenSearch}
                className="w-5 h-5 cursor-pointer"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex items-center border border-zinc-500 bg-black/80 px-2 md:px-3 py-1.5 w-44 md:w-64 transition-all duration-300">
                <button
                  type="button"
                  onClick={handleCloseSearch}
                  className="text-zinc-300 hover:text-white transition"
                  aria-label="Close search"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Titles"
                  className="ml-2 w-full bg-transparent text-sm text-white placeholder-zinc-400 outline-none"
                />
              </div>
            )}
          </div>
          
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